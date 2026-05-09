'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Search } from '@/components/Search';
import { useCart } from '@/store/CartContext';
import { LABELS } from '@/constants/labels.general';
import { A11Y_LABELS } from '@/constants/labels.a11y';

import styles from './Header.module.scss';

interface HeaderProps {
  query?: string;
  onSearch?: (query: string) => void;
  resultsCount?: number;
  loading?: boolean;
  showBack?: boolean;
  showCartIcon?: boolean;
}

export function Header({ query, onSearch, resultsCount, loading, showBack, showCartIcon = true }: HeaderProps) {
  const { totalItems } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Link href="/" className={styles.logo} aria-label={LABELS.GO_TO_HOMEPAGE}>
          <Image
            src="/logo.svg"
            alt="PhoneShop"
            width={120}
            height={40}
            className={styles.logoImg}
            priority
          />
        </Link>
        {showCartIcon && (
          <Link href="/cart" className={styles.cart} aria-label={`${A11Y_LABELS.SHOPPING_CART_WITH} ${totalItems} ${A11Y_LABELS.ITEMS}`}>
            <Image
              src={`/${totalItems > 0 ? `shopping-bag--filled` : `shopping-bag`}.svg`}
              alt=""
              width={24}
              height={24}
              className={styles.cartIcon}
            />
            <span className={styles.badge}>{totalItems}</span>
          </Link>
        )}
      </div>
      <div className={styles.bottomRow}>
        {showBack ? (
          <Link href="/" className={styles.back}>{LABELS.BACK_LINK}</Link>
        ) : query !== undefined && onSearch ? (
          <Search
            query={query}
            onSearch={onSearch}
            resultsCount={resultsCount || 0}
            loading={loading || false}
          />
        ) : null}
      </div>
    </header>
  );
}