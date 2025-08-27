import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { CartProvider } from "@/contexts/cart-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "YELLOWTOKRI - Spread the Happiness",
  description: "Your one-stop shop for cheerful products that bring smiles to everyday life",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
