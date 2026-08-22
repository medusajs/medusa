import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "The Unreal Fusion — Flagship Commerce Experience (India)",
    template: "%s | The Unreal Fusion",
  },
  description:
    "Curated luxury electronics, audiophile gear, minimalist apparel, and artisan home decor with seamless Cashfree UPI, Card payments, and Pan-India delivery.",
  keywords: [
    "Ecommerce India",
    "Cashfree Payments",
    "UPI Checkout",
    "Luxury Tech",
    "Modern Living",
    "The Unreal Fusion",
  ],
  authors: [{ name: "The Unreal Fusion" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: getBaseURL(),
    siteName: "The Unreal Fusion",
    title: "The Unreal Fusion — Flagship Commerce Experience",
    description: "Curated luxury e-commerce for India with Cashfree Payments.",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
