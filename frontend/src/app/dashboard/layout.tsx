import type React from "react"
import type { Metadata } from "next"
import "./home.css"

export const metadata: Metadata = {
  title: "AlgoLearn - Learn algorithms. Build real skill.",
  description: "Gamified coding platform for competitive programming",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="antialiased bg-slate-50 text-slate-900 min-h-screen">
      {children}
    </div>
  )
}
