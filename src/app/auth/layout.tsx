export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
