import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

describe('Navbar Component', () => {
  it('renders all main navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Books')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Members')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Issue')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Fines')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Staff')[0]).toBeInTheDocument();
  });
});
