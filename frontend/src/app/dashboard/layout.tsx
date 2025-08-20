import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk as SpaceGrotesk, JetBrains_Mono as JetBrainsMono } from "next/font/google"
import "./home.css"
// import { MatrixBackground } from "@/components/matrix-background"

const spaceGrotesk = SpaceGrotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

const jetBrainsMono = JetBrainsMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "AlgoWars - Clash with Code. Rise through the ranks.",
  description: "Gamified coding platform for competitive programming",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en" data-home className={`dark ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
    //   <body>
    <div className={` ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased bg-black`}>
        {children}
    </div>
    //   </body>
    // </html>
  )
}
