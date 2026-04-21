import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FinesPage from '../../app/fine/page';
import * as api from '../../services/api';
import toast from 'react-hot-toast';

jest.mock('../../services/api', () => ({
  getPendingFines: jest.fn(),
  payFine: jest.fn(),
}));

describe('Fines Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays pending fines', async () => {
    api.getPendingFines.mockResolvedValue({
      data: [{ fine_id: 1, member_name: 'Jane', amount: 50, issue_id: 101, book_name: 'Dune', paid_status: false }]
    });

    render(<FinesPage />);

    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('₹50')).toBeInTheDocument();
      expect(screen.getByText('Not Paid')).toBeInTheDocument();
    });
  });

  it('pays fine and shows toast', async () => {
    api.getPendingFines.mockResolvedValue({
      data: [{ fine_id: 2, amount: 100, paid_status: false }]
    });
    api.payFine.mockResolvedValue({});

    render(<FinesPage />);

    await waitFor(() => {
      expect(screen.getByText('₹100')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mark as Paid'));

    // Confirm Payment
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.payFine).toHaveBeenCalledWith(2, 100);
      expect(toast.success).toHaveBeenCalledWith('Fine marked as paid!');
    });
  });
});
