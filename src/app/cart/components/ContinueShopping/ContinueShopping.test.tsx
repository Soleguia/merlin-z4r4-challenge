import { render, screen } from '@testing-library/react';

import { ContinueShopping } from './ContinueShopping';

import '@testing-library/jest-dom';

describe('ContinueShopping', () => {
  it('renders with default text and href', () => {
    render(<ContinueShopping />);
    const link = screen.getByRole('link');
    const button = screen.getByRole('button');
    
    expect(link).toHaveAttribute('href', '/');
    expect(button).toHaveTextContent('CONTINUE SHOPPING');
  });

  it('renders with custom text and href', () => {
    render(<ContinueShopping text="GO BACK" href="/shop" />);
    const link = screen.getByRole('link');
    const button = screen.getByRole('button');
    
    expect(link).toHaveAttribute('href', '/shop');
    expect(button).toHaveTextContent('GO BACK');
  });

  it('applies custom className to the root link', () => {
    render(<ContinueShopping className="custom-class" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });
});
