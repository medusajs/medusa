import type { Metadata } from "next"
import "./globals.css"
import { config } from "@/config"
import { BareboneLayout } from "docs-ui"
import { inter, robotoMono } from "./fonts"
import clsx from "clsx"

export const metadata: Metadata = {
  title: {
    template: `%s - ${config.titleSuffix}`,
    default: config.titleSuffix || "",
  },
  description: "Explore and learn how to use Medusa.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BareboneLayout htmlClassName={clsx(inter.variable, robotoMono.variable)}>
      {children}
    </BareboneLayout>
  )
}
