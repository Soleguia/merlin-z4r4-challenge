'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/services/api';
import { Product, ColorOption, StorageOption } from '@/types';
import { Button } from '@/components/Button';
import { ProductDetailSkeleton } from '@/components/skeletons';
import { useCart } from '@/store/CartContext';
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

      if (data.colorOptions.length > 0) {
        setSelectedColor(data.colorOptions[0]);
      }
      if (data.storageOptions.length > 0) {
        setSelectedStorage(data.storageOptions[0]);
        setCurrentPrice(data.basePrice + data.storageOptions[0].price);
      }
    } catch (e) {
      setError('Error al cargar el producto');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product && selectedStorage) {
      setCurrentPrice(product.basePrice + selectedStorage.price);
    }
  }, [product, selectedStorage]);

  const handleAddToCart = () => {
    if (product && selectedColor && selectedStorage) {
      addItem(product.id, selectedColor.name, selectedStorage.capacity);
      router.push('/cart');
    }
  };

  const isValidSelection = selectedColor && selectedStorage;

  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(currentPrice);

  if (loading) {
    return (
      <div className={styles.container}>
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error || 'Producto no encontrado'}</p>
        <Button onClick={() => router.push('/')}>Volver a la tienda</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <div className={styles.imageSection}>
          <Image
            src={selectedColor?.imageUrl || product.colorOptions[0]?.imageUrl || ''}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <span className={styles.brand}>{product.brand}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.rating}>
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
            <span className={styles.ratingValue}>{product.rating}</span>
          </div>
          <span className={styles.price}>{formattedPrice}</span>

          <div className={styles.selectors}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Color</legend>
              <div className={styles.options}>
                {product.colorOptions.map((color) => (
                  <label key={color.name} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name="color"
                      value={color.name}
                      checked={selectedColor?.name === color.name}
                      onChange={() => setSelectedColor(color)}
                      className={styles.radio}
                    />
                    <span
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color.hexCode }}
                    >
                      {selectedColor?.name === color.name && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                    </span>
                    <span className={styles.optionText}>{color.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Almacenamiento</legend>
              <div className={styles.options}>
                {product.storageOptions.map((storage) => (
                  <label key={storage.capacity} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name="storage"
                      value={storage.capacity}
                      checked={selectedStorage?.capacity === storage.capacity}
                      onChange={() => setSelectedStorage(storage)}
                      className={styles.radio}
                    />
                    <span
                      className={`${styles.storageOption} ${
                        selectedStorage?.capacity === storage.capacity ? styles.selected : ''
                      }`}
                    >
                      {storage.capacity}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!isValidSelection}
            size="lg"
            className={styles.addButton}
          >
            Añadir al carrito
          </Button>

          {(!selectedColor || !selectedStorage) && (
            <p className={styles.hint}>Selecciona color y almacenamiento</p>
          )}
        </div>
      </div>

      <section className={styles.description}>
        <h2 className={styles.sectionTitle}>Descripción</h2>
        <p>{product.description}</p>
      </section>

      <section className={styles.specs}>
        <h2 className={styles.sectionTitle}>Especificaciones</h2>
        <dl className={styles.specList}>
          <div className={styles.specItem}>
            <dt>Pantalla</dt>
            <dd>{product.specs.screen}</dd>
          </div>
          <div className={styles.specItem}>
            <dt>Resolución</dt>
            <dd>{product.specs.resolution}</dd>
          </div>
          <div className={styles.specItem}>
            <dt>Procesador</dt>
            <dd>{product.specs.processor}</dd>
          </div>
          <div className={styles.specItem}>
            <dt>Cámara principal</dt>
            <dd>{product.specs.mainCamera}</dd>
          </div>
          <div className={styles.specItem}>
            <dt>Cámara frontal</dt>
            <dd>{product.specs.selfieCamera}</dd>
          </div>
          <div className={styles.specItem}>
            <dt>Batería</dt>
            <dd>{product.specs.battery}</dd>
          </div>
          <div className={styles.specItem}>
            <dt>Sistema operativo</dt>
            <dd>{product.specs.os}</dd>
          </div>
          <div className={styles.specItem}>
            <dt>Refresco de pantalla</dt>
            <dd>{product.specs.screenRefreshRate}</dd>
          </div>
        </dl>
      </section>

      {product.similarProducts.length > 0 && (
        <section className={styles.similar}>
          <h2 className={styles.sectionTitle}>Productos similares</h2>
          <div className={styles.similarGrid}>
            {product.similarProducts.map((p) => (
              <a key={p.id} href={`/product/${p.id}`} className={styles.similarItem}>
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  sizes="25vw"
                  className={styles.similarImage}
                />
                <span className={styles.similarName}>{p.name}</span>
                <span className={styles.similarPrice}>
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(p.basePrice)}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}