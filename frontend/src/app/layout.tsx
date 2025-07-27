// Remove 'use client' from layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Clash",
  description: "Compete in real-time coding battles and become a coding legend!",
};

// Move client-side logic to a separate ClientProvider component
// Create a new file: frontend/src/app/ClientProvider.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {/* Wrap children with ClientProvider for client-side logic */}
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
