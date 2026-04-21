import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MembersPage from '../../app/members/page';
import * as api from '../../services/api';
import toast from 'react-hot-toast';

jest.mock('../../services/api', () => ({
  getMembers: jest.fn(),
  createMember: jest.fn(),
  updateMember: jest.fn(),
  deleteMember: jest.fn(),
}));

describe('Members Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays members on mount', async () => {
    api.getMembers.mockResolvedValue({
      data: [{ member_id: 1, first_name: 'John', last_name: 'Doe', email_id: 'john@test.com' }]
    });

    render(<MembersPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('submits a new member', async () => {
    api.getMembers.mockResolvedValue({ data: [] });
    api.createMember.mockResolvedValue({});

    render(<MembersPage />);

    fireEvent.click(screen.getByText('+ Add New Member'));

    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('10-digit number'), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByText('Register Member'));

    await waitFor(() => {
      expect(api.createMember).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Member registered successfully!');
    });
  });
});
