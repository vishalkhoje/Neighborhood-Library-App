import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffPage from '../../app/staff/page';
import * as api from '../../services/api';
import toast from 'react-hot-toast';

jest.mock('../../services/api', () => ({
  getStaff: jest.fn(),
  createStaff: jest.fn(),
  updateStaff: jest.fn(),
  deleteStaff: jest.fn(),
}));

describe('Staff Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays staff', async () => {
    api.getStaff.mockResolvedValue({
      data: [{ staff_id: 1, staff_name: 'Admin User', staff_designation: 'Manager' }]
    });

    render(<StaffPage />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
    });
  });
});
