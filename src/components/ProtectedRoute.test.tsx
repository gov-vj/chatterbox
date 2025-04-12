import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { Session } from '@supabase/supabase-js';

const { mockGetSession } = vi.hoisted(() => {
  return { mockGetSession: vi.fn() };
});

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  Navigate: () => <div>Navigate</div>,
  Outlet: () => <div data-testid="child-content">Outlet</div>,
}));

vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
    },
  },
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockReset();
  });

  it('should briefly show loading state', async () => {
    mockGetSession.mockReturnValue(new Promise(() => {}));
    render(<ProtectedRoute/>);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should render children when authenticated', async () => {
    const mockSession = { user: { id: '123' } } as Session;
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    render(<ProtectedRoute/>);
    await waitFor(() => {
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });

  it('should NOT render children when not authenticated', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    render(<ProtectedRoute/>);
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });
});