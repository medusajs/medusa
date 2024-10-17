import React from "react"
import clsx from "clsx"
import { RootProviders, Sidebar, SidebarProps } from "@/components"
import { Toc } from "../components/Toc"
import { MainContentLayout, MainContentLayoutProps } from "./main-content"

export type RootLayoutProps = {
  bodyClassName?: string
  showToc?: boolean
  sidebarProps?: SidebarProps
  showPagination?: boolean
  feedbackComponent?: React.ReactNode
  editComponent?: React.ReactNode
  showBreadcrumbs?: boolean
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
} & MainContentLayoutProps

export const RootLayout = ({
  bodyClassName,
  sidebarProps,
  showToc = true,
  ProvidersComponent,
  ...mainProps
}: RootLayoutProps) => {
  return (
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
          <Sidebar {...sidebarProps} />
          <div className={clsx("relative", "h-screen", "flex")}>
            <MainContentLayout {...mainProps} />
            {showToc && <Toc />}
          </div>
        </ProvidersComponent>
      </RootProviders>
    </body>
  )
}
