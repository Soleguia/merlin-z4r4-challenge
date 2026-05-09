'use client';

import { SEARCH_LABELS } from '@/constants/labels.search';

import styles from './Search.module.scss';

interface SearchProps {
  query: string;
  onSearch: (query: string) => void;
  resultsCount: number;
  loading: boolean;
}

export function Search({ query, onSearch, resultsCount, loading }: SearchProps) {
  return (
    <div className={styles.search}>
      <label htmlFor="search-input" className={styles.visuallyHidden}>
        {SEARCH_LABELS.SEARCHING_FOR}
      </label>
      <input
        id="search-input"
        type="search"
        placeholder={SEARCH_LABELS.SEARCH_PLACEHOLDER}
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        className={styles.searchInput}
        aria-describedby="results-count"
      />
      <p id="results-count" className={styles.results}>
        {loading
          ? SEARCH_LABELS.SEARCHING
          : `${resultsCount} ${resultsCount !== 1 ? SEARCH_LABELS.RESULTS : SEARCH_LABELS.RESULT}`}
      </p>
    </div>
  );
}