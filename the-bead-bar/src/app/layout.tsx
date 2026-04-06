import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartErrorBoundary } from "@/components/CartErrorBoundary";
import { PwaInit } from "@/components/PwaInit";
import { Nav } from "@/components/Nav";
import { CookieBanner } from "@/components/CookieBanner/CookieBanner";
import { PostHogProvider } from "@/components/Analytics/PostHogProvider";

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
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Chic Charm Co." },
};

export const viewport: Viewport = {
  themeColor: "#8FAF8A",
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
        <PostHogProvider>
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
        </PostHogProvider>
      </body>
    </html>
  );
}
