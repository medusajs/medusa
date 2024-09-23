"use client"

import React, { useEffect } from "react"
import { useSidebar } from "../providers/Sidebar"
import clsx from "clsx"
import { Bannerv2, MainNav, useIsBrowser, useLayout } from ".."

export type MainContentLayoutProps = {
  mainWrapperClasses?: string
  showBanner?: boolean
  children: React.ReactNode
}

export const MainContentLayout = ({
  children,
  mainWrapperClasses,
  showBanner = true,
}: MainContentLayoutProps) => {
  const isBrowser = useIsBrowser()
  const { desktopSidebarOpen } = useSidebar()
  const { showSidebar } = useLayout()

  useEffect(() => {
    if (!isBrowser || !showSidebar) {
      return
    }
    const mainContentElm = document.getElementById("mainContent")
    if (desktopSidebarOpen) {
      mainContentElm?.classList.add("lg:grid-cols-[221px_1fr]")
    } else {
      mainContentElm?.classList.remove("lg:grid-cols-[221px_1fr]")
    }
  }, [desktopSidebarOpen, isBrowser, showSidebar])

  return (
    <div
      className={clsx(
        "relative max-w-full",
        "h-full flex-1",
        "flex flex-col",
        "gap-docs_0.5 lg:pt-docs_0.25 lg:mr-docs_0.25",
        !desktopSidebarOpen && "lg:ml-docs_0.25",
        mainWrapperClasses
      )}
    >
      {showBanner && <Bannerv2 />}
      <div
        className={clsx(
          "bg-medusa-bg-base",
          "flex-col items-center",
          "h-full w-full",
          "overflow-y-scroll overflow-x-hidden",
          "md:rounded-t-docs_DEFAULT shadow-elevation-card-rest",
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
  )
}
