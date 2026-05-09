'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ProductListItem } from '@/types';

import styles from './Card.module.scss';

export interface CardProps {
  product: ProductListItem;
}

export function Card({ product }: CardProps) {
  const formattedPrice = product.basePrice.toLocaleString('es-ES', {
    minimumFractionDigits: 0,
  }) + ' EUR';

  return (
    <Link href={`/product/${product.id}`} className={styles.card}>
      <div className={styles.card__imageWrapper}>
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={styles.card__image}
        />
      </div>
      <div className={styles.card__info}>
        <div className={styles.card__details}>
          <span className={styles.card__brand}>{product.brand}</span>
          <span className={styles.card__name}>{product.name}</span>
        </div>
        <span className={styles.card__price}>{formattedPrice}</span>
      </div>
    </Link>
  );
}