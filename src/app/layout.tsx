import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "../providers/auth";
import { ThemeProvider } from "../providers/theme-provider";
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
        <body className={`${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}{" "}
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
