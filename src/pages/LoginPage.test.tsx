import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage Component', () => {
  it('should render email input, password input, and login button', () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});