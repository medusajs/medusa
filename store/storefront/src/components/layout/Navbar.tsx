"use client"
import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react"

const NAV_LINKS = [
  { href: "/collections/birthday-gifts",    label: "Birthday" },
  { href: "/collections/wedding-gifts",     label: "Wedding" },
  { href: "/collections/anniversary-gifts", label: "Anniversary" },
  { href: "/collections/baby-gifts",        label: "Baby" },
  { href: "/collections/nfc-smart-cards",   label: "NFC Cards" },
  { href: "/shop",                          label: "Shop All" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gold-200 shadow-gold-sm">
      {/* Announcement bar */}
      <div className="bg-gold-500 text-white text-center py-1.5 text-xs font-sans tracking-wide">
        🎁 Free gift wrapping on orders over $50 · Made with love, shipped with care
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">✦</span>
            <div className="leading-none">
              <span className="font-serif text-xl font-bold text-charcoal-900 tracking-tight">
                MemoryLane
              </span>
              <span className="block text-[10px] text-gold-500 font-sans tracking-[0.2em] uppercase">
                Gifts
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-sans text-charcoal-800 hover:text-gold-500 transition-colors rounded-md hover:bg-gold-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/gift-finder"
              className="ml-2 px-4 py-2 text-sm font-sans bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-colors font-medium"
            >
              Gift Finder ✨
            </Link>
          </div>

          {/* Desktop icons */}
          <div className="hidden md:flex items-center gap-3">
            <button aria-label="Search" className="p-2 text-charcoal-800 hover:text-gold-500 transition-colors">
              <Search size={20} />
            </button>
            <button aria-label="Wishlist" className="p-2 text-charcoal-800 hover:text-gold-500 transition-colors">
              <Heart size={20} />
            </button>
            <Link href="/cart" aria-label="Cart" className="relative p-2 text-charcoal-800 hover:text-gold-500 transition-colors">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart" className="relative p-2 text-charcoal-800">
              <ShoppingBag size={20} />
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-charcoal-800">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gold-100 shadow-gold-md animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 text-sm font-sans text-charcoal-800 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/gift-finder"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 text-center px-4 py-3 bg-gold-500 text-white rounded-full text-sm font-medium"
            >
              Gift Finder ✨
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
