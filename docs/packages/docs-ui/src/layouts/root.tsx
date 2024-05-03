import React from "react"
import clsx from "clsx"
import { Sidebar, SidebarProps } from "@/components"

export type RootLayoutProps = {
  children: React.ReactNode
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
  NavbarComponent: React.FC
  sidebarProps?: SidebarProps
  htmlClassName?: string
  bodyClassName?: string
  mainWrapperClasses?: string
  showPagination?: boolean
}

export const RootLayout = ({
  ProvidersComponent,
  NavbarComponent,
  children,
  sidebarProps,
  htmlClassName,
  bodyClassName,
  mainWrapperClasses,
}: RootLayoutProps) => {
  return (
    <html lang="en" className={clsx("h-full w-full", htmlClassName)}>
      <head />
      <body
        className={clsx(
          "bg-docs-bg font-base text-medium w-full",
          "text-medusa-fg-subtle",
          "h-screen overflow-hidden",
          bodyClassName
        )}
      >
        <ProvidersComponent>
          <NavbarComponent />
          <div
            className="w-full h-[calc(100%-57px)] overflow-y-scroll overflow-x-hidden"
            id="main"
          >
            <div className={clsx("max-w-xxl w-full", mainWrapperClasses)}>
              <Sidebar {...sidebarProps} />
              {children}
            </div>
          </div>
        </ProvidersComponent>
      </body>
    </html>
  )
}
