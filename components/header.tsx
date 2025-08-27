import Image from "next/image"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/yellowtokri-logo.png" alt="YELLOWTOKRI" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold text-[#FFD700]">YELLOWTOKRI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-[#FFD700] transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-[#FFD700] transition-colors">
            Products
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:text-[#FFD700] transition-colors">
            Admin
          </Link>
        </nav>

        <CartDrawer />
      </div>
    </header>
  )
}
