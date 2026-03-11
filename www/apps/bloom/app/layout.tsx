import type { Metadata } from "next"
import Providers from "@/providers"
import "./globals.css"
import { BareboneLayout, TightLayout } from "docs-ui"
import { config } from "@/config"
import clsx from "clsx"
import Footer from "../components/Footer"
import { inter, robotoMono } from "./fonts"

const ogImage =
  "https://res.cloudinary.com/dza7lstvk/image/upload/v1770203331/Bloom/bloom-meta-image_ifvlyb.jpg"

export const metadata: Metadata = {
  title: {
    template: `%s - ${config.titleSuffix}`,
    default: config.titleSuffix || "",
  },
  description: config.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    images: [
      {
        url: ogImage,
        type: "image/jpeg",
        height: "1260",
        width: "2400",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: ogImage,
        type: "image/jpeg",
        height: "1260",
        width: "2400",
      },
    ],
  },
  other: {
    "algolia-site-verification":
      process.env.NEXT_PUBLIC_ALGOLIA_SITE_VERIFICATION || "",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BareboneLayout
      htmlClassName={clsx(inter.variable, robotoMono.variable)}
      gaId={process.env.NEXT_PUBLIC_GA_ID}
    >
      <TightLayout ProvidersComponent={Providers} footerComponent={<Footer />}>
        {children}
      </TightLayout>
    </BareboneLayout>
  )
}
