export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative max-w-7xl mx-auto px-4 focus:outline-none sm:px-3 md:px-5">
      {children}
    </div>
  );
}
