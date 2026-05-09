'use client';

import styles from './Skeleton.module.scss';

export interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
}: SkeletonProps) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className={styles.skeleton__card}>
      <Skeleton height="100%" borderRadius="0" />
      <div className={styles.skeleton__cardInfo}>
        <Skeleton width="40%" height="12px" />
        <Skeleton width="70%" height="16px" />
        <Skeleton width="30%" height="18px" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className={styles.skeleton__detail}>
      <Skeleton height="300px" borderRadius="var(--border-radius)" />
      <div className={styles.skeleton__detailInfo}>
        <Skeleton width="30%" height="12px" />
        <Skeleton width="60%" height="24px" />
        <Skeleton width="40%" height="18px" />
        <Skeleton width="100%" height="40px" />
      </div>
    </div>
  );
}