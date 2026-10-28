import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWAPIC - A Kinder Marketplace",
  description: "One platform. Four ways to get what you need: Buy, Sell, Rent, Barter.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-[#FAF7F2] antialiased">
        {children}
      </body>
    </html>
  );
}
