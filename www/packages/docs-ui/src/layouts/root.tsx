import React from "react"
import clsx from "clsx"
import { SidebarProps } from "@/components"
import { MainContentLayoutProps } from "./main-content"
import { RootLayoutContent } from "./root-content"

export type RootLayoutProps = {
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
  showToc?: boolean
  showSidebar?: boolean
  sidebarProps?: SidebarProps
  htmlClassName?: string
  bodyClassName?: string
  showPagination?: boolean
  feedbackComponent?: React.ReactNode
  editComponent?: React.ReactNode
} & MainContentLayoutProps

export const RootLayout = ({
  ProvidersComponent,
  htmlClassName,
  bodyClassName,
  ...props
}: RootLayoutProps) => {
  return (
    <html lang="en" className={clsx("h-full w-full", htmlClassName)}>
      <head />
      <body
        className={clsx(
          "bg-medusa-bg-subtle font-base text-medium w-full",
          "text-medusa-fg-subtle",
          bodyClassName
        )}
      >
        <ProvidersComponent>
          <RootLayoutContent {...props} />
        </ProvidersComponent>
      </body>
    </html>
  )
}
