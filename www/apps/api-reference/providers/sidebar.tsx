"use client"

import React from "react"
import {
  SidebarProvider as UiSidebarProvider,
  usePageLoading,
  useScrollController,
} from "docs-ui"
import { usePathname } from "next/navigation"
import { Sidebar } from "types"
import { useCallback, useEffect, useState } from "react"
import { config } from "../config"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { isLoading, setIsLoading } = usePageLoading()
  const { scrollableElement } = useScrollController()
  const [sidebar, setSidebar] = useState<Sidebar.Sidebar | undefined>()
  const path = usePathname()

  const loadSidebar = useCallback(async () => {
    if (path.startsWith("/store")) {
      return (await import("../generated/generated-store-sidebar.mjs"))
        .default as Sidebar.Sidebar
    }

    return (await import("../generated/generated-admin-sidebar.mjs"))
      .default as Sidebar.Sidebar
  }, [path])

  useEffect(() => {
    loadSidebar()
      .then(setSidebar)
      .catch((error) => {
        console.error("Error loading sidebar:", error)
      })
  }, [loadSidebar])

  return (
    <UiSidebarProvider
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      shouldHandleHashChange={true}
      shouldHandlePathChange={false}
      scrollableElement={scrollableElement}
      sidebars={sidebar ? [sidebar] : config.sidebars}
      persistCategoryState={false}
      disableActiveTransition={false}
      isSidebarStatic={false}
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
