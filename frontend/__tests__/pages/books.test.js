import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BooksPage from '../../app/books/page';
import * as api from '../../services/api';
import toast from 'react-hot-toast';

// Mock the API service
jest.mock('../../services/api', () => ({
  getBooks: jest.fn(),
  createBook: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
}));

describe('Books Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays books on mount', async () => {
    const mockBooks = [
      { book_id: 1, book_title: 'Test Book', author_name: 'Author Name', copies_total: 5, available_copies: 5 }
    ];
    api.getBooks.mockResolvedValue({ data: mockBooks });

    render(<BooksPage />);

    // Wait for the book to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
    expect(api.getBooks).toHaveBeenCalledTimes(1);
  });

  it('opens add book modal and submits form', async () => {
    api.getBooks.mockResolvedValue({ data: [] });
    api.createBook.mockResolvedValue({ data: { book_id: 2 } });

    render(<BooksPage />);

    // Click add button
    const addButton = screen.getByText('+ Add New Book');
    fireEvent.click(addButton);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter full book title'), { target: { value: 'Test Book' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Robert Martin'), { target: { value: 'Author Name' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 978-3-16-148410-0'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 5'), { target: { value: '2' } });

    const submitButton = screen.getByText('Add Book');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.createBook).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Book created successfully!');
    });
  });

  it('handles delete confirmation', async () => {
    const mockBooks = [
      { book_id: 1, book_title: 'To Delete Book', author_name: 'Author' }
    ];
    api.getBooks.mockResolvedValue({ data: mockBooks });
    api.deleteBook.mockResolvedValue({});

    render(<BooksPage />);

    await waitFor(() => {
      expect(screen.getByText('To Delete Book')).toBeInTheDocument();
    });

    // We look for the delete button. In the UI it's usually an SVG or button with text "Delete"
    // For simplicity, we just trigger deleteBook if the button is there.
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm modal should appear
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.deleteBook).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Book deleted successfully!');
    });
  });
});
