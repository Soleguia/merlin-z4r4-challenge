'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/CartContext';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Go to homepage">
          <span className={styles.logoText}>PhoneShop</span>
        </Link>
        <Link href="/cart" className={styles.cart} aria-label={`Shopping cart with ${totalItems} items`}>
          <Image
            src="/cart-icon.svg"
            alt=""
            width={24}
            height={24}
            className={styles.cartIcon}
          />
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}