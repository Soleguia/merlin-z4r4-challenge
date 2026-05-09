import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { CartContextType } from '@/types';

import '@testing-library/jest-dom';

const mockCartContext: CartContextType = {
  items: [],
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  totalItems: 3,
  getItemQuantity: jest.fn(),
};

jest.mock('@/store/CartContext', () => ({
  useCart: () => mockCartContext,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo link to homepage', () => {
    render(<Header />);
    const logoLink = screen.getByLabelText('Go to homepage');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders cart link when showCartIcon is true (default)', () => {
    render(<Header />);
    const cartLink = screen.getByLabelText(/shopping cart with 3 items/i);
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('hides cart link when showCartIcon is false', () => {
    render(<Header showCartIcon={false} />);
    expect(screen.queryByLabelText(/shopping cart/i)).not.toBeInTheDocument();
  });

  it('displays cart badge with item count', () => {
    render(<Header />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders search when query and onSearch are provided', () => {
    render(<Header query="iphone" onSearch={jest.fn()} resultsCount={5} />);
    expect(screen.getByLabelText(/search for a smartphone/i)).toBeInTheDocument();
  });

  it('does not render search when showBack is true', () => {
    render(<Header showBack query="test" onSearch={jest.fn()} />);
    expect(screen.queryByLabelText(/search for a smartphone/i)).not.toBeInTheDocument();
  });

  it('renders back link when showBack is true', () => {
    render(<Header showBack />);
    expect(screen.getByText('< BACK')).toBeInTheDocument();
  });

  it('does not render back link by default', () => {
    render(<Header />);
    expect(screen.queryByText('< BACK')).not.toBeInTheDocument();
  });
});