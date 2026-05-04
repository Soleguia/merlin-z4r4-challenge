'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/services/api';
import { CartItemWithProduct, Product } from '@/types';
import { Button } from '@/components/Button';
import { useCart } from '@/store/CartContext';
import styles from './page.module.scss';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems } = useCart();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    async function loadCartItems() {
      setLoading(true);
      const loadedItems: CartItemWithProduct[] = [];

      for (const item of items) {
        try {
          const product = (await getProductById(item.productId)) as Product;
          const colorOption = product.colorOptions.find((c) => c.name === item.colorName);
          const storageOption = product.storageOptions.find((s) => s.capacity === item.storageCapacity);

          if (colorOption && storageOption) {
            const itemPrice = product.basePrice + storageOption.price;
            loadedItems.push({
              ...item,
              product,
              colorOption,
              storageOption,
              quantity: item.quantity,
            });
          }
        } catch (e) {
          console.error('Error loading product:', e);
        }
      }

      setCartItems(loadedItems);
      setLoading(false);
    }

    loadCartItems();
  }, [items]);

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      const itemPrice = item.product.basePrice + item.storageOption.price;
      total += itemPrice * item.quantity;
    }
    setTotalPrice(total);
  }, [cartItems]);

  const handleRemove = (productId: string, colorName: string, storageCapacity: string) => {
    removeItem(productId, colorName, storageCapacity);
  };

  const handleDecrease = (
    productId: string,
    colorName: string,
    storageCapacity: string,
    quantity: number
  ) => {
    updateQuantity(productId, colorName, storageCapacity, quantity - 1);
  };

  const handleIncrease = (
    productId: string,
    colorName: string,
    storageCapacity: string,
    quantity: number
  ) => {
    updateQuantity(productId, colorName, storageCapacity, quantity + 1);
  };

  const getItemPrice = (item: CartItemWithProduct): number => {
    return item.product.basePrice + item.storageOption.price;
  };

  const formattedTotal = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalPrice);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Carrito</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Carrito</h1>

      {cartItems.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Tu carrito está vacío</p>
          <Link href="/">
            <Button variant="primary">Seguir comprando</Button>
          </Link>
        </div>
      ) : (
        <>
          <ul className={styles.list}>
            {cartItems.map((item) => (
              <li
                key={`${item.productId}-${item.colorName}-${item.storageCapacity}`}
                className={styles.item}
              >
                <div className={styles.itemImage}>
                  <Image
                    src={item.colorOption.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="100px"
                    className={styles.image}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <span className={styles.itemBrand}>{item.product.brand}</span>
                  <h3 className={styles.itemName}>{item.product.name}</h3>
                  <p className={styles.itemVariant}>
                    {item.colorName} / {item.storageCapacity}
                  </p>
                  <p className={styles.itemPrice}>
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(getItemPrice(item))}
                  </p>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantity}>
                    <button
                      onClick={() =>
                        handleDecrease(
                          item.productId,
                          item.colorName,
                          item.storageCapacity,
                          item.quantity
                        )
                      }
                      className={styles.quantityBtn}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleIncrease(
                          item.productId,
                          item.colorName,
                          item.storageCapacity,
                          item.quantity
                        )
                      }
                      className={styles.quantityBtn}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleRemove(item.productId, item.colorName, item.storageCapacity)
                    }
                    className={styles.removeBtn}
                    aria-label={`Eliminar ${item.product.name} del carrito`}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.summary}>
            <div className={styles.totalRow}>
              <span>Total ({totalItems} productos)</span>
              <span className={styles.totalPrice}>{formattedTotal}</span>
            </div>

            <Link href="/" className={styles.continueLink}>
              <Button variant="secondary" className={styles.continueBtn}>
                Continuar comprando
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}