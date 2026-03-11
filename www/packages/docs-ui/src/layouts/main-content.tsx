"use client"

import React, { useEffect } from "react"
import clsx from "clsx"
import {
  MainNav,
  useAiAssistant,
  useIsBrowser,
  useLayout,
  useSidebar,
  useSiteConfig,
} from ".."
import { ContentMenu } from "../components/ContentMenu"

export type MainContentLayoutProps = {
  mainWrapperClasses?: string
  contentClassName?: string
  children: React.ReactNode
  showContentMenu?: boolean
}

export const MainContentLayout = ({
  children,
  mainWrapperClasses,
  contentClassName,
  showContentMenu = true,
}: MainContentLayoutProps) => {
  const { isBrowser } = useIsBrowser()
  const { desktopSidebarOpen } = useSidebar()
  const { mainContentRef, showCollapsedNavbar } = useLayout()
  const { frontmatter, isInProduct } = useSiteConfig()
  const { chatOpened } = useAiAssistant()

  useEffect(() => {
    if (!isBrowser) {
      return
    }
    const rootLayout = document.getElementById("root-layout")
    if (desktopSidebarOpen) {
      rootLayout?.classList.add("lg:grid-cols-[221px_1fr]")
    } else {
      rootLayout?.classList.remove("lg:grid-cols-[221px_1fr]")
    }
  }, [desktopSidebarOpen, isBrowser])

  return (
    <div
      className={clsx(
        "relative max-w-full",
        "h-full flex-1",
        "flex flex-col",
        "gap-docs_0.5 lg:py-docs_0.25 lg:mr-docs_0.25 scroll-m-docs_0.25",
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
          "md:rounded-docs_DEFAULT",
          "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
          mainWrapperClasses
        )}
        id="main"
        ref={mainContentRef}
      >
        <MainNav />
        <div
          className={clsx(
            "pb-docs_8 lg:pb-docs_4",
            showContentMenu && !isInProduct && "grid grid-cols-1 lg:mx-auto",
            desktopSidebarOpen && "lg:grid-cols-[1fr_221px]",
            chatOpened && showCollapsedNavbar && "pl-docs_1",
            !isInProduct && "pt-docs_4 lg:pt-docs_6",
            isInProduct && "pt-docs_2",
            contentClassName
          )}
          id="content"
        >
          <div className="flex justify-center">{children}</div>
        </div>
        {showContentMenu && !frontmatter.hide_content_menu && !isInProduct && (
          <ContentMenu />
        )}
      </div>
    </div>
  )
}
