import clsx from "clsx"
import React from "react"
import { RootProviders } from "../components"

export type BareboneLayoutProps = {
  htmlClassName?: string
  bodyClassName?: string
  children: React.ReactNode
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
}

export const BareboneLayout = ({
  htmlClassName,
  bodyClassName,
  children,
  ProvidersComponent,
}: BareboneLayoutProps) => {
  return (
    <html lang="en" className={clsx("h-full w-full", htmlClassName)}>
      <head />
      <body
        className={clsx(
          "bg-medusa-bg-subtle font-base text-medium w-full",
          "text-medusa-fg-subtle",
          "h-screen overflow-hidden",
          "grid grid-cols-1 lg:mx-auto lg:grid-cols-[221px_1fr]",
          bodyClassName
        )}
      >
        <RootProviders>
          <ProvidersComponent>{children}</ProvidersComponent>
        </RootProviders>
      </body>
    </html>
  )
}
