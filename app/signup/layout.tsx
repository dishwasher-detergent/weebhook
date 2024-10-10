export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid place-items-center w-full min-h-dvh">{children}</main>
  );
}
