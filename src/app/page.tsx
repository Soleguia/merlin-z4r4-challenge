'use client';

import { useEffect, useState, useRef } from 'react';

import { getProducts } from '@/services/api';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { CardSkeleton } from '@/components/skeletons';
import { useSearch } from '@/hooks/useSearch';
import { ProductListItem } from '@/types';
import { SEARCH_LABELS } from '@/constants/labels.search';

import styles from './page.module.scss';

export default function HomePage() {
  const { query, setQuery, debouncedQuery } = useSearch();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSearchingRef = useRef(false);

  useEffect(() => {
    isSearchingRef.current = query.length > 0;
  }, [query]);

  useEffect(() => {
    const fetchProducts = async (search?: string) => {
      setLoading(true);
      setError(null);
      if (search) {
        setProducts([]);
      }
      try {
        const data = (await getProducts({
          search: search || undefined,
          limit: 20,
        })) as ProductListItem[];
        const uniqueProducts = [...new Map(data.map(p => [p.id, p])).values()];
        setProducts(uniqueProducts);
      } catch (e) {
        setError(SEARCH_LABELS.ERROR_LOADING_PRODUCTS);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(isSearchingRef.current ? debouncedQuery : undefined);
  }, [debouncedQuery]);

  return (
    <div className={styles.container}>
      <Header
        query={query}
        onSearch={setQuery}
        resultsCount={products.length}
        loading={loading}
      />

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.grid} aria-label="Product list">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : query.length > 0 && products.length === 0
            ? <p className={styles.noResults}>{SEARCH_LABELS.NO_PRODUCTS_FOUND}</p>
            : products.map((product) => (
              <Card key={product.id} product={product} />
            ))}
      </section>
    </div>
  );
}