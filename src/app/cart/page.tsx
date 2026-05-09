'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useCart } from '@/store/CartContext';
import { CartItemWithProduct, Product } from '@/types';
import { getProductById } from '@/services/api';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { CART_LABELS } from '@/constants/labels.cart';
import { LABELS } from '@/constants/labels.general';

import { ContinueShopping } from './components/ContinueShopping/ContinueShopping';
import styles from './page.module.scss';


export default function CartPage() {
  const { items, removeItem, totalItems } = useCart();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    async function loadProduct(item: typeof items[number]): Promise<CartItemWithProduct | null> {
      try {
        const product = (await getProductById(item.productId)) as Product;
        const colorOption = product.colorOptions.find((c) => c.name === item.colorName);
        const storageOption = product.storageOptions.find((s) => s.capacity === item.storageCapacity);

        if (colorOption && storageOption) {
          return {
            ...item,
            product,
            colorOption,
            storageOption,
            error: undefined,
          };
        }
        return {
          ...item,
          product: null,
          colorOption: { name: item.colorName, hexCode: '', imageUrl: '' },
          storageOption: { capacity: item.storageCapacity, price: 0 },
          error: CART_LABELS.OPTION_NOT_AVAILABLE,
        };
      } catch {
        return {
          ...item,
          product: null,
          colorOption: { name: item.colorName, hexCode: '', imageUrl: '' },
          storageOption: { capacity: item.storageCapacity, price: 0 },
          error: CART_LABELS.FAILED_TO_LOAD_PRODUCT,
        };
      }
    }

    async function loadCartItems() {
      setLoading(true);
      const loadedItems: CartItemWithProduct[] = [];

      for (const item of items) {
        const loaded = await loadProduct(item);
        if (loaded) {
          loadedItems.push(loaded);
        }
      }

      setCartItems(loadedItems);
      setLoading(false);
    }

    if (items.length > 0) {
      loadCartItems();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [items]);

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item.product) {
        const itemPrice = item.product.basePrice + item.storageOption.price;
        total += itemPrice * item.quantity;
      }
    }
    setTotalPrice(total);
  }, [cartItems]);

  const handleRemove = (productId: string, colorName: string, storageCapacity: string) => {
    removeItem(productId, colorName, storageCapacity);
  };

  const handleRetry = async (index: number) => {
    const item = items[index];
    if (item) {
      try {
        const product = (await getProductById(item.productId)) as Product;
        const colorOption = product.colorOptions.find((c) => c.name === item.colorName);
        const storageOption = product.storageOptions.find((s) => s.capacity === item.storageCapacity);

        if (colorOption && storageOption) {
          setCartItems((prev) => {
            const newItems = [...prev];
            newItems[index] = {
              ...item,
              product,
              colorOption,
              storageOption,
              error: undefined,
            };
            return newItems;
          });
        }
      } catch {
        // Handle error silently
      }
    }
  };

  const getItemPrice = (item: CartItemWithProduct): number => {
    if (!item.product) return 0;
    return item.product.basePrice + item.storageOption.price;
  };

  const formattedTotal = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(totalPrice);

  if (loading) {
    return (
      <div className={styles.cart__container} role="status" aria-live="polite">
        <h1 className={styles.cart__title}>{CART_LABELS.CART_TITLE}</h1>
        <p>{CART_LABELS.LOADING_CART}</p>
      </div>
    );
  }

  return (
    <div className={styles.cart__container}>
      <Header showCartIcon={false} />

      <div className={styles.cart__content}>
        <h1 className={styles.cart__title}>{CART_LABELS.CART_TITLE} ({totalItems})</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.cart__empty}>
          <ContinueShopping />
        </div>
      ) : (
        <>
          <ul className={styles.cart__list}>
            {cartItems.map((item, index) => (
              item.error ? (
                <li
                  key={`${item.productId}-${item.storageCapacity}-${item.colorName}`}
                  className={styles.cart__item}
                >
                  <article className={`${styles.cart__itemContent} ${styles.cart__itemError}`}>
                    <div className={styles.cart__itemDetails}>
                      <div className={styles.cart__itemInfo}>
                        <h3 className={styles.cart__itemName}>{item.storageCapacity}</h3>
                        <p className={styles.cart__itemVariant}>{item.colorName}</p>
                        <p className={styles.cart__errorMessage}>{item.error}</p>
                      </div>
                      <div className={styles.cart__itemActions}>
                        <button
                          onClick={() => handleRetry(index)}
                          className={styles.cart__retryBtn}
                          aria-label={LABELS.RETRY}
                        >
                          {LABELS.RETRY}
                        </button>
                        <button
                          onClick={() =>
                            handleRemove(item.productId, item.colorName, item.storageCapacity)
                          }
                          className={styles.cart__removeBtn}
                          aria-label={`${LABELS.REMOVE} ${item.product!.name} ${CART_LABELS.FROM_CART}`}
                        >
                          {LABELS.REMOVE}
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ) : (
                <li
                  key={`${item.productId}-${item.storageCapacity}-${item.colorName}`}
                  className={styles.cart__item}
                >
                  <article className={styles.cart__itemContent}>
                    <div className={styles.cart__itemImage}>
                      <Image
                        src={item.colorOption.imageUrl}
                        alt={item.product!.name}
                        fill
                        sizes="120px"
                        className={styles.cart__image}
                      />
                    </div>
                    <div className={styles.cart__itemDetails}>
                      <div className={styles.cart__itemInfo}>
                        <h3 className={styles.cart__itemName}>{item.product!.name}</h3>
                        <p className={styles.cart__itemVariant}>
                          {item.storageCapacity} | {item.colorName}
                        </p>
                        {item.quantity > 1 && (
                          <>
                            <p className={styles.cart__itemUnits}>{CART_LABELS.ITEM_UNITS}: {item.quantity}</p>
                            <p className={styles.cart__unitPrice}>
                              {CART_LABELS.UNIT_PRICE_LABEL}:{' '}
                              {new Intl.NumberFormat('es-ES', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                              }).format(getItemPrice(item))}
                            </p>
                          </>
                        )}
                        <p className={styles.cart__itemPrice}>
                          {item.quantity > 1 ? `${CART_LABELS.TOTAL_LABEL}: ` : ''}
                          {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                            minimumFractionDigits: 0,
                          }).format(getItemPrice(item) * item.quantity)}
                        </p>
                      </div>

                      <div className={styles.cart__itemActions}>
                        <button
                          onClick={() =>
                            handleRemove(item.productId, item.colorName, item.storageCapacity)
                          }
                          className={styles.cart__removeBtn}
                          aria-label={`${LABELS.REMOVE} ${item.product!.name} ${CART_LABELS.FROM_CART}`}
                        >
                          {LABELS.REMOVE}
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              )
            ))}
          </ul>


          <div className={styles.cart__summary}>
            <div className={styles.cart__continueShoppingBtn}>
              <ContinueShopping />
            </div>
            <div className={styles.cart__totalRow}>
              <span>{CART_LABELS.TOTAL_LABEL}</span>
              <span className={styles.cart__totalPrice}>{formattedTotal}</span>
            </div>

            <div className={styles.cart__payBtn}>
              <Button variant="primary" className={styles.cart__checkoutBtn}>
                {CART_LABELS.PAY}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}