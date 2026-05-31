import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL("https://memorylane.gifts"),
  title: {
    default: "MemoryLane Gifts | Personalised Gifts for Every Occasion",
    template: "%s | MemoryLane Gifts",
  },
  description:
    "Handcrafted, personalised gifts for birthdays, weddings, anniversaries & more. Laser engraving, custom printing, and NFC smart cards. Made to order with love.",
  keywords: [
    "personalised gifts", "laser engraved gifts", "custom gifts",
    "birthday gifts", "wedding gifts", "anniversary gifts",
    "NFC cards", "engraved keychains", "photo mugs",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "MemoryLane Gifts",
    images: ["/og-image.jpg"],
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-charcoal-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
