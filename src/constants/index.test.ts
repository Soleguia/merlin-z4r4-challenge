import { SEARCH_LABELS, CART_LABELS, LABELS, PRODUCT_LABELS, A11Y_LABELS } from '@/constants';

describe('Constants', () => {
  describe('SEARCH_LABELS', () => {
    it('has SEARCHING', () => {
      expect(SEARCH_LABELS.SEARCHING).toBe('Searching...');
    });

    it('has SEARCH_PLACEHOLDER', () => {
      expect(SEARCH_LABELS.SEARCH_PLACEHOLDER).toBe('Search for a smartphone...');
    });

    it('has RESULTS', () => {
      expect(SEARCH_LABELS.RESULTS).toBe('RESULTS');
    });

    it('has RESULT', () => {
      expect(SEARCH_LABELS.RESULT).toBe('RESULT');
    });

    it('has NO_PRODUCTS_FOUND', () => {
      expect(SEARCH_LABELS.NO_PRODUCTS_FOUND).toBe('No products found');
    });

    it('has ERROR_LOADING_PRODUCTS', () => {
      expect(SEARCH_LABELS.ERROR_LOADING_PRODUCTS).toBe('Error loading products');
    });
  });

  describe('CART_LABELS', () => {
    it('has CART_TITLE', () => {
      expect(CART_LABELS.CART_TITLE).toBe('Cart');
    });

    it('has LOADING_CART', () => {
      expect(CART_LABELS.LOADING_CART).toBe('Loading cart...');
    });

    it('has TOTAL_LABEL', () => {
      expect(CART_LABELS.TOTAL_LABEL).toBe('Total');
    });

    it('has PAY', () => {
      expect(CART_LABELS.PAY).toBe('Pay');
    });

    it('has OPTION_NOT_AVAILABLE', () => {
      expect(CART_LABELS.OPTION_NOT_AVAILABLE).toBe('Option not available');
    });

    it('has FAILED_TO_LOAD_PRODUCT', () => {
      expect(CART_LABELS.FAILED_TO_LOAD_PRODUCT).toBe('Failed to load product');
    });

    it('has FROM_CART', () => {
      expect(CART_LABELS.FROM_CART).toBe('from cart');
    });
  });

  describe('LABELS', () => {
    it('has RETRY', () => {
      expect(LABELS.RETRY).toBe('Retry');
    });

    it('has REMOVE', () => {
      expect(LABELS.REMOVE).toBe('Remove');
    });

    it('has BACK_TO_STORE', () => {
      expect(LABELS.BACK_TO_STORE).toBe('Back to store');
    });

    it('has GO_TO_HOMEPAGE', () => {
      expect(LABELS.GO_TO_HOMEPAGE).toBe('Go to homepage');
    });

    it('has BACK_LINK', () => {
      expect(LABELS.BACK_LINK).toBe('< BACK');
    });
  });

  describe('PRODUCT_LABELS', () => {
    it('has ERROR_LOADING_PRODUCT', () => {
      expect(PRODUCT_LABELS.ERROR_LOADING_PRODUCT).toBe('Error loading product');
    });

    it('has PRODUCT_NOT_FOUND', () => {
      expect(PRODUCT_LABELS.PRODUCT_NOT_FOUND).toBe('Product not found');
    });

    it('has ADD_TO_CART', () => {
      expect(PRODUCT_LABELS.ADD_TO_CART).toBe('ADD TO CART');
    });

    it('has SPECIFICATIONS', () => {
      expect(PRODUCT_LABELS.SPECIFICATIONS).toBe('SPECIFICATIONS');
    });

    it('has SIMILAR_ITEMS', () => {
      expect(PRODUCT_LABELS.SIMILAR_ITEMS).toBe('SIMILAR ITEMS');
    });
  });

  describe('A11Y_LABELS', () => {
    it('has SHOPPING_CART_WITH', () => {
      expect(A11Y_LABELS.SHOPPING_CART_WITH).toBe('Shopping cart with');
    });

    it('has ITEMS', () => {
      expect(A11Y_LABELS.ITEMS).toBe('items');
    });

    it('has MAIN_NAVIGATION', () => {
      expect(A11Y_LABELS.MAIN_NAVIGATION).toBe('Main navigation');
    });
  });
});