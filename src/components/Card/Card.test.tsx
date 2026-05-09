import { render, screen } from '@testing-library/react';

import { Card } from './Card';

import '@testing-library/jest-dom';

const mockProduct = {
  id: '1',
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  basePrice: 999,
  imageUrl: '/iphone15.jpg',
};

describe('Card', () => {
  it('renders product image with correct alt text', () => {
    render(<Card product={mockProduct} />);
    const image = screen.getByAltText('Apple iPhone 15 Pro');
    expect(image).toBeInTheDocument();
  });

  it('renders product name', () => {
    render(<Card product={mockProduct} />);
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
  });

  it('renders product brand', () => {
    render(<Card product={mockProduct} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<Card product={mockProduct} />);
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
  });

  it('links to correct product detail page', () => {
    render(<Card product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });

  it('renders with correct structure', () => {
    render(<Card product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('card');
    expect(link).toHaveAttribute('class');
  });
});