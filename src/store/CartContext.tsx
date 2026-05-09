'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';

import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; colorName: string; storageCapacity: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; colorName: string; storageCapacity: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; colorName: string; storageCapacity: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, colorName: string, storageCapacity: string) => void;
  removeItem: (productId: string, colorName: string, storageCapacity: string) => void;
  updateQuantity: (productId: string, colorName: string, storageCapacity: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  getItemQuantity: (productId: string, colorName: string, storageCapacity: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zara-challenge-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, colorName, storageCapacity } = action.payload;
      const normalizedColor = colorName.trim();
      const normalizedStorage = storageCapacity.trim();

      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.colorName.trim() === normalizedColor &&
          item.storageCapacity.trim() === normalizedStorage
      );

      if (existingIndex >= 0) {
        const newItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { items: newItems };
      }

      return {
        items: [...state.items, { productId, colorName: normalizedColor, storageCapacity: normalizedStorage, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM': {
      const { productId, colorName, storageCapacity } = action.payload;
      return {
        items: state.items.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.colorName === colorName &&
              item.storageCapacity === storageCapacity
            )
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, colorName, storageCapacity, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.colorName === colorName &&
                item.storageCapacity === storageCapacity
              )
          ),
        };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId &&
          item.colorName === colorName &&
          item.storageCapacity === storageCapacity
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    case 'LOAD_CART':
      return { items: action.payload };

    default:
      return state;
  }
}

function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  }
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => ({
    items: getInitialCart(),
  }));

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (productId: string, colorName: string, storageCapacity: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, colorName, storageCapacity } });
  };

  const removeItem = (productId: string, colorName: string, storageCapacity: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, colorName, storageCapacity } });
  };

  const updateQuantity = (
    productId: string,
    colorName: string,
    storageCapacity: string,
    quantity: number
  ) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, colorName, storageCapacity, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const getItemQuantity = (
    productId: string,
    colorName: string,
    storageCapacity: string
  ): number => {
    const item = state.items.find(
      (i) =>
        i.productId === productId &&
        i.colorName === colorName &&
        i.storageCapacity === storageCapacity
    );
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}