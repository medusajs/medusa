import type { Metadata } from "next"

import { Providers } from "@/providers"

import { siteConfig } from "@/config/site"
import "../styles/globals.css"
import { TightLayout } from "docs-ui"
import { Inter, Roboto_Mono } from "next/font/google"
import clsx from "clsx"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TightLayout
      ProvidersComponent={Providers}
      sidebarProps={{
        expandItems: true,
      }}
      bodyClassName={clsx(inter.variable, robotoMono.variable)}
    >
      {children}
    </TightLayout>
  )
}
