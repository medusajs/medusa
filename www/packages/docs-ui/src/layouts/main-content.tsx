"use client"

import React, { useEffect } from "react"
import { useSidebar } from "../providers/Sidebar"
import clsx from "clsx"
import { Bannerv2, MainNav, useIsBrowser } from ".."

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

  useEffect(() => {
    if (!isBrowser) {
      return
    }
    if (desktopSidebarOpen) {
      document.body.classList.add("lg:grid-cols-[221px_1fr]")
    } else {
      document.body.classList.remove("lg:grid-cols-[221px_1fr]")
    }
  }, [desktopSidebarOpen, isBrowser])

  return (
    <div
      className={clsx(
        "relative",
        "h-full flex-1",
        "flex flex-col",
        "gap-docs_0.5 lg:pt-docs_0.5 lg:mr-docs_0.25",
        !desktopSidebarOpen && "lg:ml-docs_0.25",
        mainWrapperClasses
      )}
    >
      {showBanner && <Bannerv2 />}
      <div
        className={clsx(
          "bg-medusa-bg-base",
          "flex-col items-start",
          "h-full w-full",
          "overflow-y-scroll overflow-x-hidden",
          "md:rounded shadow-elevation-card-rest",
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
