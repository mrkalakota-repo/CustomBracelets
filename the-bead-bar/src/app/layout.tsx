import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartErrorBoundary } from "@/components/CartErrorBoundary";
import { PwaInit } from "@/components/PwaInit";
import { Nav } from "@/components/Nav";
import { CookieBanner } from "@/components/CookieBanner/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:       "Chic Charm Co.",
  description: "Custom bracelets, seasonal drops & BFF sets.",
  manifest:    "/manifest.json",
  themeColor:  "#8FAF8A",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Chic Charm Co." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <PwaInit />
              <Nav />
              {children}
              <CookieBanner />
            </CartProvider>
          </AuthProvider>
        </CartErrorBoundary>
      </body>
    </html>
  );
}
