// Remove 'use client' from layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoWars",
  description: "Compete in real-time algorithm battles and become a coding legend!",
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-space antialiased bg-neutral-950 selection:bg-lime-600 selection:text-white`}
      >
        {/* Wrap children with ClientProvider for client-side logic */}
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
