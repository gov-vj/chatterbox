import { render, screen } from '@testing-library/react';
import MessageList from './MessageList';
import { DbMessage } from '../types';
import { User } from '@supabase/supabase-js';

const CURRENT_USER_ID = 'user-abc';
const OTHER_USER_ID = 'user-xyz';

const currentUser: User = {
  id: CURRENT_USER_ID,
  email: 'abc@example.com',
} as User;

const mockMessages: DbMessage[] = [
  {
    id: 'msg1',
    created_at: '2024-01-01T10:00:00+00:00',
    sender_id: OTHER_USER_ID, // Sent by other user
    receiver_id: CURRENT_USER_ID,
    message: 'Hello there!',
  },
  {
    id: 'msg2',
    created_at: '2024-01-01T10:01:00+00:00',
    sender_id: CURRENT_USER_ID, // Sent by current user
    receiver_id: OTHER_USER_ID,
    message: 'Hi! How are you?',
  },
  {
    id: 'msg3',
    created_at: '2024-01-01T10:02:00+00:00',
    sender_id: OTHER_USER_ID, // Sent by other user
    receiver_id: CURRENT_USER_ID,
    message: 'Good, thanks!',
  },
];

describe('MessageList Component', () => {
  it('should render placeholder when messages array is empty', () => {
    render(<MessageList messages={[]} currentUser={currentUser} />);
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });

  it('should render placeholder if currentUserId is undefined', () => {
    render(<MessageList messages={mockMessages} currentUser={null} />);
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });

  it('should render all messages text', () => {
    render(<MessageList messages={mockMessages} currentUser={currentUser} />);

    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
    expect(screen.getByText('Good, thanks!')).toBeInTheDocument();
  });

  it('should apply different alignment based on sender', () => {
    render(<MessageList messages={mockMessages} currentUser={currentUser} />);

    // Find the message containers (the divs with flex justify-*)
    const message1Container = screen.getByText('Hello there!').closest('div.flex');
    const message2Container = screen.getByText('Hi! How are you?').closest('div.flex');
    const message3Container = screen.getByText('Good, thanks!').closest('div.flex');

    // Message 1 is from OTHER_USER_ID
    expect(message1Container).toBeInTheDocument();
    expect(message1Container).toHaveClass('justify-start');
    expect(message1Container).not.toHaveClass('justify-end');

    // Message 2 is from CURRENT_USER_ID
    expect(message2Container).toBeInTheDocument();
    expect(message2Container).toHaveClass('justify-end');
    expect(message2Container).not.toHaveClass('justify-start');

    // Message 3 is from OTHER_USER_ID
    expect(message3Container).toBeInTheDocument();
    expect(message3Container).toHaveClass('justify-start');
    expect(message3Container).not.toHaveClass('justify-end');
  });
});