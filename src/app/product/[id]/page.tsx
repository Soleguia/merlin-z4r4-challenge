'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import { getProductById } from '@/services/api';
import { useCart } from '@/store/CartContext';
import { Product, ColorOption, StorageOption } from '@/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ProductDetailSkeleton } from '@/components/skeletons';
import { PRODUCT_LABELS } from '@/constants/labels.product';
import { LABELS } from '@/constants/labels.general';

import styles from './page.module.scss';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  const productId = params.id as string;

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await getProductById(productId)) as Product;
      setProduct(data);
      // No initial selection as per user request
      setSelectedColor(null);
      setSelectedStorage(null);
      setCurrentPrice(data.basePrice);
    } catch (e) {
      setError(PRODUCT_LABELS.ERROR_LOADING_PRODUCT);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product) {
      const storagePrice = selectedStorage?.price || 0;
      setCurrentPrice(product.basePrice + storagePrice);
    }
  }, [product, selectedStorage]);

  const handleAddToCart = () => {
    if (product && selectedColor && selectedStorage) {
      addItem(product.id, selectedColor.name, selectedStorage.capacity);
      router.push('/cart');
    }
  };

  const isValidSelection = selectedColor !== null && selectedStorage !== null;

  const formattedPrice = `From ${new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
  }).format(currentPrice)} EUR`;

  if (loading) {
    return (
      <div className={styles.container} role="status" aria-live="polite">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.productDetail__container} role="alert">
        <p 
          className={styles.productDetail__error} 
          id="product-error"
          aria-invalid="true"
        >
          {error || PRODUCT_LABELS.PRODUCT_NOT_FOUND}
        </p>
        <Button 
          onClick={() => router.push('/')} 
          aria-describedby="product-error"
        >
          {LABELS.BACK_TO_STORE}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.productDetail__container}>
      <Header showBack />
      <div className={styles.productDetail__detail}>
        <div className={styles.productDetail__imageSection}>
          <Image
            src={selectedColor?.imageUrl || product.colorOptions[0]?.imageUrl || ''}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.productDetail__image}
            priority
          />
        </div>

        <div className={styles.productDetail__info}>
          <h1 className={styles.productDetail__name}>{product.name}</h1>
          <span className={styles.productDetail__price}>{formattedPrice}</span>

          <div className={styles.productDetail__selectors}>
            <fieldset className={styles.productDetail__fieldset}>
              <legend className={styles.productDetail__legend} id="storage-legend">{PRODUCT_LABELS.STORAGE_QUESTION}</legend>
              <div className={styles.productDetail__options} role="radiogroup" aria-labelledby="storage-legend">
                {product.storageOptions.map((storage) => (
                  <label key={storage.capacity} className={styles.productDetail__optionLabel}>
                    <input
                      type="radio"
                      name="storage"
                      value={storage.capacity}
                      checked={selectedStorage?.capacity === storage.capacity}
                      onChange={() => setSelectedStorage(storage)}
                      className={styles.productDetail__radio}
                      aria-describedby="storage-legend"
                    />
                    <span
                      className={`${styles.productDetail__storageOption} ${selectedStorage?.capacity === storage.capacity ? styles.selected : ''
                        }`}
                    >
                      {storage.capacity}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.productDetail__fieldset}>
              <legend className={styles.productDetail__legend} id="color-legend">{PRODUCT_LABELS.COLOR_QUESTION}</legend>
              <div className={styles.productDetail__options} role="radiogroup" aria-labelledby="color-legend">
                {product.colorOptions.map((color) => (
                  <label key={color.name} className={styles.productDetail__optionLabel}>
                    <input
                      type="radio"
                      name="color"
                      value={color.name}
                      checked={selectedColor?.name === color.name}
                      onChange={() => setSelectedColor(color)}
                      className={styles.productDetail__radio}
                      aria-describedby="color-legend"
                    />
                    <span
                      className={`${styles.productDetail__colorSwitch} ${selectedColor?.name === color.name ? styles.selected : ''
                        }`}
                      style={{ backgroundColor: color.hexCode }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!isValidSelection}
            size="lg"
            className={styles.productDetail__addButton}
          >
            {PRODUCT_LABELS.ADD_TO_CART}
          </Button>
        </div>
      </div>

      <section className={styles.productDetail__specs}>
        <h2 className={styles.productDetail__sectionTitle}>{PRODUCT_LABELS.SPECIFICATIONS}</h2>
        <dl className={styles.productDetail__specList}>
          <div className={styles.productDetail__specItem}>
            <dt className={styles.productDetail__specItemSpecName}>BRAND</dt>
            <dd className={styles.productDetail__specItemSpecInfo}>{product.brand}</dd>
          </div>
          <div className={styles.productDetail__specItem}>
            <dt className={styles.productDetail__specItemSpecName}>NAME</dt>
            <dd className={styles.productDetail__specItemSpecInfo}>{product.name}</dd>
          </div>
          <div className={styles.productDetail__specItem}>
            <dt className={styles.productDetail__specItemSpecName}>DESCRIPTION</dt>
            <dd className={styles.productDetail__specItemSpecInfo}>{product.description}</dd>
          </div>
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className={styles.productDetail__specItem}>
              <dt className={styles.productDetail__specItemSpecName}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</dt>
              <dd className={styles.productDetail__specItemSpecInfo}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {product.similarProducts.length > 0 && (
        <section className={styles.productDetail__similar}>
          <h2 className={styles.productDetail__sectionTitle}>{PRODUCT_LABELS.SIMILAR_ITEMS}</h2>
          <div className={styles.productDetail__similarScroll}>
            {product.similarProducts.map((p) => (
              <Card
                key={p.id}
                product={{
                  id: p.id,
                  brand: p.brand,
                  name: p.name,
                  basePrice: p.basePrice,
                  imageUrl: p.imageUrl,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}