import { render, screen, fireEvent } from '@testing-library/react';
import MessageInput from './MessageInput';

describe('MessageInput Component', () => {
  it('should render input field and send button', () => {
    const mockOnSendMessage = vi.fn();
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should call onSendMessage with message text on submit and clear input', async () => {
    const mockOnSendMessage = vi.fn();
    const { getByPlaceholderText, getByRole } = render(<MessageInput onSendMessage={mockOnSendMessage} />);
    const input = getByPlaceholderText(/type a message/i);
    const sendButton = getByRole('button', { name: /send/i });

    await fireEvent.change(input, { target: { value: 'Hello, world!' } });
    await fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello, world!');
    expect(input).toHaveValue('');
  });

  it('should disable send button when input is empty', async () => {
    const mockOnSendMessage = vi.fn();
    const { getByPlaceholderText, getByRole } = render(<MessageInput onSendMessage={mockOnSendMessage} />);
    const input = getByPlaceholderText(/type a message/i);
    const sendButton = getByRole('button', { name: /send/i });

    expect(sendButton).toBeDisabled();

    await fireEvent.change(input, { target: { value: 'a' } });
    expect(sendButton).not.toBeDisabled();
  });
});