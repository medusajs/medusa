"use client"

import React, { useEffect } from "react"
import { useSidebar } from "../providers/Sidebar"
import clsx from "clsx"
import { MainNav, useIsBrowser } from ".."

export type MainContentLayoutProps = {
  mainWrapperClasses?: string
  contentClassName?: string
  children: React.ReactNode
}

export const MainContentLayout = ({
  children,
  mainWrapperClasses,
  contentClassName,
}: MainContentLayoutProps) => {
  const { isBrowser } = useIsBrowser()
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
        "relative max-w-full",
        "h-full flex-1",
        "flex flex-col",
        "gap-docs_0.5 lg:pt-docs_0.25 lg:mr-docs_0.25 scroll-m-docs_0.25",
        !desktopSidebarOpen && "lg:ml-docs_0.25",
        mainWrapperClasses
      )}
    >
      <div
        className={clsx(
          "bg-medusa-bg-base",
          "flex-col items-center",
          "h-full w-full",
          "overflow-y-scroll overflow-x-hidden",
          "md:rounded-t-docs_DEFAULT",
          "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
          mainWrapperClasses
        )}
        id="main"
      >
        <MainNav />
        <div
          className={clsx(
            "flex justify-center",
            "pt-docs_4 lg:pt-docs_6 pb-docs_8 lg:pb-docs_4",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
