"use client"

import React, { useEffect, useMemo } from "react"
import clsx from "clsx"
import {
  getOsShortcut,
  Kbd,
  MainNav,
  Tooltip,
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
  showContentMenu: initialShowContentMenu = true,
}: MainContentLayoutProps) => {
  const { isBrowser } = useIsBrowser()
  const { desktopSidebarOpen, setDesktopSidebarOpen } = useSidebar()
  const { mainContentRef, showCollapsedNavbar } = useLayout()
  const { frontmatter, isInProduct } = useSiteConfig()
  const { chatOpened } = useAiAssistant()
  const osShortcut = getOsShortcut()

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

  const showContentMenu = useMemo(() => {
    return (
      initialShowContentMenu &&
      !frontmatter.hide_content_menu &&
      !isInProduct &&
      (!chatOpened || (chatOpened && !showCollapsedNavbar))
    )
  }, [
    initialShowContentMenu,
    frontmatter.hide_content_menu,
    isInProduct,
    chatOpened,
    showCollapsedNavbar,
  ])

  const sidebarCollapser = (className?: string) => (
    <Tooltip
      render={() => (
        <div className="flex gap-[6px] justify-center items-center">
          <span className="text-compact-x-small-plus text-medusa-fg-base">
            {desktopSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          </span>
          <Kbd>{osShortcut}</Kbd>
          <Kbd>\</Kbd>
        </div>
      )}
      className={clsx(
        "hidden lg:block absolute h-[20px] w-[3px] top-1/2 -translate-y-1/2 z-20",
        className
      )}
      innerClassName="w-full h-full inline-block"
    >
      <button
        className={clsx(
          "rounded-[2px] bg-medusa-alphas-alpha-24 h-full w-full cursor-pointer",
          "appearance-none p-0 border-none focus:outline-none active:outline-none"
        )}
        onClick={() => setDesktopSidebarOpen((prev) => !prev)}
      />
    </Tooltip>
  )

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
        {/* Sidebar + content menu collapser */}
        {sidebarCollapser("left-docs_0.25")}
        <div
          className={clsx(
            "pb-docs_8 lg:pb-docs_4",
            showContentMenu && "grid grid-cols-1 lg:mx-auto",
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
        {/* Sidebar + content menu collapser */}
        {showContentMenu && (
          <>
            {sidebarCollapser(
              desktopSidebarOpen ? "right-[242px]" : "right-docs_0.25"
            )}
            {desktopSidebarOpen && <ContentMenu />}
          </>
        )}
      </div>
    </div>
  )
}
