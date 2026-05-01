import "./globals.css";

export const metadata = {
  title: "ShieldLend",
  description: "Private liquidation protection for Solana lending using Arcium."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
