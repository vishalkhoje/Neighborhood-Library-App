import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IssuePage from '../../app/issue/page';
import * as api from '../../services/api';
import toast from 'react-hot-toast';

jest.mock('../../services/api', () => ({
  getIssues: jest.fn(),
  getBooks: jest.fn(),
  getMembers: jest.fn(),
  getStaffs: jest.fn(),
  issueBook: jest.fn(),
  returnBook: jest.fn(),
}));

describe('Issue Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getBooks.mockResolvedValue({ data: [] });
    api.getMembers.mockResolvedValue({ data: [] });
    api.getStaffs.mockResolvedValue({ data: [] });
  });

  it('fetches issues on mount', async () => {
    api.getIssues.mockResolvedValue({
      data: [{ issue_id: 1, book_name: '1984', member_name: 'John Doe', issue_status: 'ISSUED' }]
    });

    render(<IssuePage />);

    await waitFor(() => {
      expect(screen.getByText('1984')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('triggers return book API', async () => {
    api.getIssues.mockResolvedValue({
      data: [{ issue_id: 1, book_name: '1984', issue_status: 'ISSUED' }]
    });
    api.returnBook.mockResolvedValue({ data: { fine: 0 } });

    render(<IssuePage />);

    await waitFor(() => {
      expect(screen.getByText('1984')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Return'));
    
    // The Confirm modal pops up
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.returnBook).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Book returned on time. No fine applied.');
    });
  });

  it('issues a book using searchable dropdowns', async () => {
    api.getIssues.mockResolvedValue({ data: [] });
    api.getBooks.mockResolvedValue({ data: [{ book_id: 2, book_title: 'Clean Code' }] });
    api.getMembers.mockResolvedValue({ data: [{ member_id: 5, first_name: 'Vishal', last_name: 'Khoje' }] });
    api.issueBook.mockResolvedValue({ data: {} });

    render(<IssuePage />);

    // Open Form
    fireEvent.click(screen.getByText('+ Issue a Book'));

    // Search and select book
    const bookInput = screen.getByPlaceholderText('Search by ID or Title...');
    fireEvent.change(bookInput, { target: { value: 'Clean' } });
    
    await waitFor(() => {
      expect(screen.getByText('Clean Code')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Clean Code'));

    // Search and select member
    const memberInput = screen.getByPlaceholderText('Search by ID or Name...');
    fireEvent.change(memberInput, { target: { value: 'Vishal' } });

    await waitFor(() => {
      expect(screen.getByText('Vishal Khoje')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Vishal Khoje'));

    // Submit
    fireEvent.click(screen.getByText('Confirm Issue'));

    await waitFor(() => {
      expect(api.issueBook).toHaveBeenCalledWith(expect.objectContaining({
        book_id: 2,
        member_id: 5
      }));
    });
  });
});
