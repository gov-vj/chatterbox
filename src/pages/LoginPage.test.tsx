import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import {supabase} from "../supabaseClient.ts";

vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));



describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>).mockReset();
  })
  it('should render email input, password input, and login button', () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call supabase signInWithPassword and navigate on successful login', async () => {
    const user = userEvent.setup();
    const mockSuccessResponse = {
      data: { user: { id: '123', email: 'test@example.com' }, session: {} },
      error: null,
    };
    (supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>).mockResolvedValue(mockSuccessResponse);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/chat');
    });

    expect(screen.queryByText(/invalid login credentials/i)).not.toBeInTheDocument();
  });

  it('should display error message on failed login (Supabase error)', async () => {
    const user = userEvent.setup();
    const mockErrorResponse = {
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials', status: 400, name: 'AuthApiError' },
    };
    (supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>).mockResolvedValue(mockErrorResponse);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    const errorMessage = await screen.findByText(/invalid login credentials/i);
    expect(errorMessage).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should disable button and show loading state during login attempt', async () => {
    const user = userEvent.setup();
    // Mock a response that takes time (or just check state immediately after click)
    (supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>).mockResolvedValue({ data: {}, error: null }); // Mock immediate success for simplicity

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent(/logging in.../i);
  });
});