import type { Metadata } from 'next';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tamanjaya Sukabumi',
  description: 'Seru',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="scrollbar-hide flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
