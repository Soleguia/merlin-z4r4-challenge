'use client';

import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../store/CartContext';
import { ReactNode } from 'react';

import '@testing-library/jest-dom';

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem('product-1', 'Black', '256GB');
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({
      productId: 'product-1',
      colorName: 'Black',
      storageCapacity: '256GB',
      quantity: 1,
    });
  });

  it('increments quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem('product-1', 'Black', '256GB');
      result.current.addItem('product-1', 'Black', '256GB');
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem('product-1', 'Black', '256GB');
      result.current.removeItem('product-1', 'Black', '256GB');
    });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('calculates totalItems correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem('product-1', 'Black', '256GB');
      result.current.addItem('product-1', 'Black', '256GB');
      result.current.addItem('product-2', 'White', '512GB');
    });
    
    expect(result.current.totalItems).toBe(3);
  });

  it('clears entire cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem('product-1', 'Black', '256GB');
      result.current.addItem('product-2', 'White', '512GB');
      result.current.clearCart();
    });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('gets item quantity for specific product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addItem('product-1', 'Black', '256GB');
      result.current.addItem('product-1', 'Black', '256GB');
    });
    
    const quantity = result.current.getItemQuantity('product-1', 'Black', '256GB');
    expect(quantity).toBe(2);
  });

  it('returns 0 for non-existent item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    result.current.addItem('product-1', 'Black', '256GB');
    
    const quantity = result.current.getItemQuantity('product-99', 'Black', '256GB');
    expect(quantity).toBe(0);
  });
});