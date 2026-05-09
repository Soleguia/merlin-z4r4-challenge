import type { Metadata } from 'next';

import { CartProvider } from '@/store/CartContext';

import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Phoneshop - Smartphones shop',
  description: 'Smartphones store with the best user experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CartProvider>
          <main id="main-content">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}