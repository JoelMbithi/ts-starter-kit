
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main className="p-4">
    SIDEBAR
    {children}
   </main>
      
  );
}
