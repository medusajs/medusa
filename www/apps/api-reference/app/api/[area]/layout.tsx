import clsx from "clsx"
import "../../../css/globals.css"
import Navbar from "@/components/Navbar"
import { Inter } from "next/font/google"
import { Roboto_Mono } from "next/font/google"
import Providers from "../../../providers"
import { Sidebar } from "docs-ui"

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
    <html lang="en" className={clsx("h-full w-full")}>
      <body
        className={clsx(
          inter.variable,
          robotoMono.variable,
          "bg-docs-bg font-base text-medium w-full",
          "text-medusa-fg-subtle",
          "h-screen overflow-hidden"
        )}
      >
        <Providers>
          <Navbar />
          <div
            className="w-full h-[calc(100%-57px)] overflow-y-scroll overflow-x-hidden"
            id="main"
          >
            <div className="max-w-xxl mx-auto flex w-full px-1.5">
              <Sidebar />
              <main className="lg:w-ref-main relative mt-4 w-full flex-1 lg:mt-7">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
