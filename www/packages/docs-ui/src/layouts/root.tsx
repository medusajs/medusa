import React from "react"
import clsx from "clsx"
import { RootProviders, Sidebar, SidebarProps } from "@/components"
import { MobileNavigation } from "../components/MobileNavigation"
import { Toc } from "../components/Toc"
import { MainContentLayout, MainContentLayoutProps } from "./main-content"

export type RootLayoutProps = {
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
  showToc?: boolean
  sidebarProps?: SidebarProps
  htmlClassName?: string
  bodyClassName?: string
  showPagination?: boolean
  feedbackComponent?: React.ReactNode
  editComponent?: React.ReactNode
} & MainContentLayoutProps

export const RootLayout = ({
  ProvidersComponent,
  sidebarProps,
  htmlClassName,
  bodyClassName,
  showToc = true,
  ...mainProps
}: RootLayoutProps) => {
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
          <ProvidersComponent>
            <MobileNavigation />
            <Sidebar {...sidebarProps} />
            <div className={clsx("relative", "h-screen", "flex")}>
              <MainContentLayout {...mainProps} />
              {showToc && <Toc />}
            </div>
          </ProvidersComponent>
        </RootProviders>
      </body>
    </html>
  )
}
