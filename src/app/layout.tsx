import type { Metadata } from 'next';
import { CartProvider } from '@/store/CartContext';
import { Navbar } from '@/components/Navbar';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'PhoneShop - Tienda de Móviles',
  description: 'Tienda de teléfonos móviles con la mejor experiencia de usuario',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}