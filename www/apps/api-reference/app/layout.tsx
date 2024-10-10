import "./globals.css"
import Providers from "../providers"
import { BareboneLayout, WideLayout } from "docs-ui"
import { Inter, Roboto_Mono } from "next/font/google"
import clsx from "clsx"

export const metadata = {
  title: "Medusa API Reference",
  description: "Check out Medusa's API reference",
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
    <BareboneLayout
      ProvidersComponent={Providers}
      bodyClassName={clsx(inter.variable, robotoMono.variable)}
    >
      <WideLayout
        sidebarProps={{
          expandItems: false,
        }}
        showToc={false}
        showBanner={false}
        showBreadcrumbs={false}
      >
        {children}
      </WideLayout>
    </BareboneLayout>
  )
}
