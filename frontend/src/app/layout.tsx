// Remove 'use client' from layout.tsx
import type { Metadata } from "next";
import { Geist_Mono, Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import AuthGuard from "@/components/AuthGuard";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "AlgoLearn",
  description: "A competitive learning platform for data structures and algorithms.",
  keywords: "programming, coding, algorithms, competition, peer challenge",
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
        className={`${geistMono.variable} ${inter.variable} ${sourceSerif.variable} ${inter.className} antialiased bg-white text-slate-900 selection:bg-blue-200 selection:text-blue-950`}
      >
        <ClientProvider>
          <AuthGuard>{children}</AuthGuard>
        </ClientProvider>
      </body>
    </html>
  );
}
