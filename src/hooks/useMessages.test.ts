import { renderHook, waitFor, act } from '@testing-library/react';
import { useMessages } from './useMessages';
import { vi } from 'vitest';
import { User } from '@supabase/supabase-js';
import { DbMessage, UserProfile } from '../types';

const {
  mockSelectMessages, mockOrMessages, mockOrderMessages, mockFrom,
  mockSubscribe, mockUnsubscribe, mockOn, mockChannel, mockRemoveChannel
} = vi.hoisted(() => {
  const mockOrder = vi.fn();
  const mockOr = vi.fn(() => ({ order: mockOrder }));
  const mockSelect = vi.fn(() => ({ or: mockOr }));
  const mockFromFn = vi.fn(() => ({ select: mockSelect }));
  const mockSub = vi.fn();
  const mockUnsub = vi.fn();
  const mockOnFn = vi.fn(() => ({ subscribe: mockSub }));
  const mockChan = vi.fn(() => ({ on: mockOnFn }));
  const mockRemoveChan = vi.fn();
  return {
    mockSelectMessages: mockSelect,
    mockOrMessages: mockOr,
    mockOrderMessages: mockOrder,
    mockFrom: mockFromFn,
    mockSubscribe: mockSub,
    mockUnsubscribe: mockUnsub,
    mockOn: mockOnFn,
    mockChannel: mockChan,
    mockRemoveChannel: mockRemoveChan
  };
});

vi.mock('../supabaseClient', () => ({
  supabase: {
    from: mockFrom,
    channel: mockChannel,
    removeChannel: mockRemoveChannel,
  },
}));

const mockCurrentUser: User = { id: 'user-id-1', email: 'user1@example.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' };
const mockOtherUser: UserProfile = { id: 'user-id-2', email: 'user2@example.com', display_name: 'User Two' };
const mockInitialMessages: DbMessage[] = [{ id: 'm1', sender_id: mockOtherUser.id, receiver_id: mockCurrentUser.id, message: 'Test', created_at: '' }];

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectMessages.mockReset();
    mockOrMessages.mockReset();
    mockOrderMessages.mockReset();
    mockFrom.mockClear();
    mockSubscribe.mockReset().mockImplementation(() => ({ unsubscribe: mockUnsubscribe }));
    mockOn.mockReset().mockReturnValue({ subscribe: mockSubscribe });
    mockChannel.mockReset().mockReturnValue({ on: mockOn });
    mockRemoveChannel.mockReset();
    mockUnsubscribe.mockReset();
  });

  it('should fetch initial messages and set up subscription', async () => {
    mockOrderMessages.mockResolvedValue({ data: mockInitialMessages, error: null });

    const { result, unmount } = renderHook(() => useMessages(mockCurrentUser, mockOtherUser));
    await waitFor(() => {
      expect(result.current.messages).toEqual(mockInitialMessages);
    });
    expect(mockFrom).toHaveBeenCalledWith('messages');
    expect(mockSelectMessages).toHaveBeenCalledWith('*');
    expect(mockOrMessages).toHaveBeenCalledWith(`and(sender_id.eq.${mockCurrentUser.id},receiver_id.eq.${mockOtherUser.id}),and(sender_id.eq.${mockOtherUser.id},receiver_id.eq.${mockCurrentUser.id})`);
    expect(mockOrderMessages).toHaveBeenCalledWith('created_at', { ascending: true });

    expect(mockChannel).toHaveBeenCalled();
    expect(mockOn).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(mockRemoveChannel).toHaveBeenCalledTimes(1);
  });

  it('should return empty array and not fetch/subscribe if users are null', () => {
    const { result } = renderHook(() => useMessages(null, null));
    expect(result.current.messages).toEqual([]);
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockChannel).not.toHaveBeenCalled();
  });
});