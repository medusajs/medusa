"use client"

import { BareboneLayout, BrowserProvider, ErrorPage } from "docs-ui"
import { inter, robotoMono } from "./fonts"
import clsx from "clsx"
import "./globals.css"

export default function Error() {
  return (
    <BareboneLayout
      htmlClassName={clsx(inter.variable, robotoMono.variable)}
      gaId={process.env.NEXT_PUBLIC_GA_ID}
    >
      <body className="w-screen h-screen overflow-hidden bg-medusa-bg-subtle">
        <BrowserProvider>
          <ErrorPage />
        </BrowserProvider>
      </body>
    </BareboneLayout>
  )
}
