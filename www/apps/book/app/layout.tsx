import type { Metadata } from "next"
import "./globals.css"
import { config } from "@/config"
import { BareboneLayout } from "docs-ui"
import { inter, robotoMono } from "./fonts"
import clsx from "clsx"

const ogImage =
  "https://res.cloudinary.com/dza7lstvk/image/upload/v1732200992/Medusa%20Resources/opengraph-image_daq6nx.jpg"

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
  alternates: {
    types: {
      "text/plain": "/llms.txt",
    },
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
      {children}
    </BareboneLayout>
  )
}
