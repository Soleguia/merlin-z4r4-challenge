import Link from 'next/link';

import { Button } from '@/components/Button';

import styles from './ContinueShopping.module.scss';

export interface ContinueShoppingProps {
  text?: string;
  href?: string;
  className?: string;
}

export function ContinueShopping({
  text = 'CONTINUE SHOPPING',
  href = '/',
  className,
}: ContinueShoppingProps) {
  return (
    <Link href={href} className={`${styles.continueLink} ${className || ''}`}>
      <Button variant="secondary" className={styles.continueBtn}>
        {text}
      </Button>
    </Link>
  );
}
