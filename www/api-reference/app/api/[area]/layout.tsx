import SidebarProvider from "@/providers/sidebar"
import Sidebar from "@/components/Sidebar"
import clsx from "clsx"
import "../../../css/globals.css"
import BaseSpecsProvider from "@/providers/base-specs"
import Navbar from "@/components/Navbar"
import ColorModeProvider from "@/providers/color-mode"
import { Inter } from "next/font/google"
import { Roboto_Mono } from "next/font/google"
import AnalyticsProvider from "@/providers/analytics"
import NavbarProvider from "@/providers/navbar"

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
          "bg-docs-bg dark:bg-docs-bg-dark font-base text-medium h-full w-full",
          "text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark"
        )}
      >
        <AnalyticsProvider>
          <ColorModeProvider>
            <BaseSpecsProvider>
              <SidebarProvider>
                <NavbarProvider>
                  <div className="max-w-xxl mx-auto w-full px-1.5">
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="lg:w-api-ref-main relative mt-7 w-full flex-1">
                        {children}
                      </main>
                    </div>
                  </div>
                </NavbarProvider>
              </SidebarProvider>
            </BaseSpecsProvider>
          </ColorModeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}
