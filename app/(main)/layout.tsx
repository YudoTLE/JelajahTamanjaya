import Footer from '@/components/footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <main className="scrollbar-hide flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
