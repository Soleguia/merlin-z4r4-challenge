import { getProducts, getProductById } from './api';

import '@testing-library/jest-dom';

global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('fetches all products without params', async () => {
      const mockProducts = [{ id: '1', name: 'iPhone 15' }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      });

      const result = await getProducts();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': '87909682e6cd74208f41a6ef39fe4191',
          }),
        })
      );
      expect(result).toEqual(mockProducts);
    });

    it('fetches products with search param', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getProducts({ search: 'iphone' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=iphone'),
        expect.any(Object)
      );
    });

    it('fetches products with limit param', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getProducts({ limit: 10 });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
    });

    it('fetches products with offset param', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getProducts({ offset: 20 });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('offset=20'),
        expect.any(Object)
      );
    });

    it('combines multiple params', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getProducts({ search: 'samsung', limit: 5, offset: 10 });

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain('search=samsung');
      expect(calledUrl).toContain('limit=5');
      expect(calledUrl).toContain('offset=10');
    });

    it('throws error on failed response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      });

      await expect(getProducts()).rejects.toThrow('Not found');
    });
  });

  describe('getProductById', () => {
    it('fetches product by id', async () => {
      const mockProduct = { id: '1', name: 'iPhone 15 Pro' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      });

      const result = await getProductById('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/1'),
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual(mockProduct);
    });

    it('throws error when product not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Product not found' }),
      });

      await expect(getProductById('999')).rejects.toThrow('Product not found');
    });
  });
});