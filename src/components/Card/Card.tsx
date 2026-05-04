'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductListItem } from '@/types';
import styles from './Card.module.scss';

export interface CardProps {
  product: ProductListItem;
}

export function Card({ product }: CardProps) {
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.basePrice);

  return (
    <Link href={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <span className={styles.brand}>{product.brand}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>{formattedPrice}</span>
      </div>
    </Link>
  );
}