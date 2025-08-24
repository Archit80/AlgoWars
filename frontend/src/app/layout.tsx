// Remove 'use client' from layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import AuthGuard from "@/components/AuthGuard";

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

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AlgoWars",
  description: "Compete in real-time algorithm battles and become a coding legend!",
  keywords: "programming, coding, algorithms, competition, battle",
  authors: [{ name: "Archit Taneja" }],
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${dmSans.variable} font-dm-sans antialiased bg-neutral-950 selection:bg-lime-600 selection:text-white`}
      >
        <ClientProvider>
          <AuthGuard>{children}</AuthGuard>
        </ClientProvider>
      </body>
    </html>
  );
}
