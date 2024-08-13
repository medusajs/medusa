import React from "react"
import clsx from "clsx"
import { Bannerv2, MainNav, Sidebar, SidebarProps } from "@/components"
import { MobileNavigation } from "../components/MobileNavigation"
import { Toc } from "../components/Toc"

export type RootLayoutProps = {
  children: React.ReactNode
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
  showToc?: boolean
  sidebarProps?: SidebarProps
  htmlClassName?: string
  bodyClassName?: string
  mainWrapperClasses?: string
  showPagination?: boolean
  showBanner?: boolean
}

export const RootLayout = ({
  ProvidersComponent,
  children,
  sidebarProps,
  htmlClassName,
  bodyClassName,
  mainWrapperClasses,
  showToc = true,
  showBanner = true,
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
        <ProvidersComponent>
          <MobileNavigation />
          <Sidebar {...sidebarProps} />
          <div className={clsx("relative", "h-screen", "flex")}>
            <div
              className={clsx(
                "lg:pt-docs_0.5 lg:mr-docs_0.5 relative",
                "h-full flex-1",
                "flex flex-col gap-docs_0.5",
                mainWrapperClasses
              )}
            >
              {showBanner && <Bannerv2 />}
              <div
                className={clsx(
                  "bg-medusa-bg-base md:rounded",
                  "shadow-elevation-card-rest",
                  "flex-col items-start",
                  "h-full w-full",
                  "overflow-y-scroll overflow-x-hidden",
                  mainWrapperClasses
                )}
                id="main"
              >
                <MainNav />
                <div
                  className={clsx(
                    "flex justify-center",
                    "pt-docs_4 lg:pt-docs_6 pb-docs_8 lg:pb-docs_4"
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
            {showToc && <Toc />}
          </div>
        </ProvidersComponent>
      </body>
    </html>
  )
}
