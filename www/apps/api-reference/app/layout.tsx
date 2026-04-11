import "./globals.css"
import Providers from "../providers"
import { BareboneLayout, WideLayout } from "docs-ui"
import clsx from "clsx"
import { Metadata } from "next"
import { inter, robotoMono } from "./fonts"
import { config } from "@/config"

const ogImage =
  "https://res.cloudinary.com/dza7lstvk/image/upload/v1732200992/Medusa%20Resources/opengraph-image_daq6nx.jpg"

export const metadata: Metadata = {
  title: `%s - ${config.titleSuffix}`,
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
      <WideLayout
        showBreadcrumbs={false}
        ProvidersComponent={Providers}
        showContentMenu={false}
      >
        {children}
      </WideLayout>
    </BareboneLayout>
  )
}
