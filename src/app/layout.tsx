import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "../../providers/sesseion";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Olímpiada",
  description: "Fique por dentro ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} dark`}>{children}</body>
      </AuthProvider>
    </html>
  );
}
