import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

import '@testing-library/jest-dom';

const mockCartContext = {
  items: [],
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  totalItems: 2,
  getItemQuantity: jest.fn(),
};

jest.mock('@/store/CartContext', () => ({
  useCart: () => mockCartContext,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navbar with proper accessibility attributes', () => {
    render(<Navbar />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('renders logo link to homepage', () => {
    render(<Navbar />);
    const logoLink = screen.getByLabelText('Go to homepage');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders cart link', () => {
    render(<Navbar />);
    const cartLink = screen.getByLabelText(/shopping cart with 2 items/i);
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('displays cart badge when items > 0', () => {
    render(<Navbar />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});