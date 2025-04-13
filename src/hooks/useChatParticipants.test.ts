import { renderHook, waitFor } from '@testing-library/react';
import { useChatParticipants } from './useChatParticipants';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const { mockGetUser, mockEqProfiles, mockSingleProfiles, mockFrom } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  return {
    mockGetUser: vi.fn(),
    mockEqProfiles: mockEq,
    mockSingleProfiles: mockSingle,
    mockFrom: vi.fn(() => ({ select: vi.fn(() => ({ eq: mockEq })) })),
  };
});

const USER_ONE_EMAIL = import.meta.env.VITE_ALLOWED_USER_1_EMAIL;
const USER_TWO_EMAIL = import.meta.env.VITE_ALLOWED_USER_2_EMAIL;

vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: { getUser: mockGetUser },
    from: mockFrom,
  },
}));

const mockCurrentUser: User = {
  id: 'user-id-1', email: USER_ONE_EMAIL, app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '',
};
const mockOtherUser: UserProfile = { id: 'user-id-2', email: USER_TWO_EMAIL, display_name: 'User Two' };

describe('useChatParticipants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockReset();
    mockEqProfiles.mockReset();
    mockSingleProfiles.mockReset();
    mockFrom.mockClear();
  });

  it('should return current user and other user profile', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockCurrentUser }, error: null });
    mockSingleProfiles.mockResolvedValue({ data: mockOtherUser, error: null });

    const { result } = renderHook(() => useChatParticipants());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.currentUser).toEqual(mockCurrentUser);
    expect(result.current.otherUserProfile).toEqual(mockOtherUser);

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith('profiles');
    expect(mockEqProfiles).toHaveBeenCalledWith('email', USER_TWO_EMAIL);
    expect(mockSingleProfiles).toHaveBeenCalledTimes(1);
  });
});