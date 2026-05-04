'use client';

import { useEffect, useState, useCallback } from 'react';
import { getProducts } from '@/services/api';
import { ProductListItem } from '@/types';
import { Card } from '@/components/Card';
import { CardSkeleton } from '@/components/skeletons';
import { useSearch } from '@/hooks/useSearch';
import styles from './page.module.scss';

export default function HomePage() {
  const { query, setQuery, debouncedQuery, isSearching } = useSearch();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await getProducts({
        search: debouncedQuery,
        limit: 20,
      })) as ProductListItem[];
      setProducts(data);
    } catch (e) {
      setError('Error al cargar productos');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Móviles</h1>
        <div className={styles.search}>
          <label htmlFor="search-input" className="visually-hidden">
            Buscar teléfonos
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Buscar por marca o nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            aria-describedby="results-count"
          />
        </div>
        <p id="results-count" className={styles.results}>
          {loading
            ? 'Buscando...'
            : `${products.length} resultado${products.length !== 1 ? 's' : ''}`}
        </p>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.grid} aria-label="Lista de productos">
        {loading || isSearching
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : products.map((product) => (
              <Card key={product.id} product={product} />
            ))}
      </section>
    </div>
  );
}