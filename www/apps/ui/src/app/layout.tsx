import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"

import { Navbar } from "@/components/navbar"
import { Providers } from "@/providers"

import { siteConfig } from "@/config/site"
import "../styles/globals.css"
import { Sidebar } from "docs-ui"

const inter = Inter({ subsets: ["latin"], variable: "--inter" })
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
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
    <html lang="en" className="h-full w-full">
      <head />
      <body
        className={`bg-docs-bg h-screen overflow-hidden w-full ${inter.variable} ${robotoMono.variable}`}
      >
        <Providers>
          <Navbar />
          <div
            className="w-full h-[calc(100%-57px)] overflow-y-scroll overflow-x-hidden"
            id="main"
          >
            <div className="max-w-xxl grid w-full grid-cols-1 px-6 lg:mx-auto lg:grid-cols-[280px_1fr]">
              <Sidebar expandItems={true} />
              <div className="relative flex w-full flex-1 items-start justify-center px-4 pb-8 pt-16 md:px-8 lg:px-16 lg:py-[112px]">
                <main className="h-full w-full lg:max-w-[720px] lg:px-px">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
