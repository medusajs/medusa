"use client"

import React from "react"
import { createContext, useEffect } from "react"
import { useSidebar } from "docs-ui"
import { useArea } from "./area"
import { Sidebar } from "types"

const PageTitleContext = createContext(null)

type PageTitleProviderProps = {
  children: React.ReactNode
}

const PageTitleProvider = ({ children }: PageTitleProviderProps) => {
  const { activePath, activeItem } = useSidebar()
  const { displayedArea } = useArea()

  useEffect(() => {
    const titleSuffix = `Medusa ${displayedArea} API Reference`

    if (!activePath?.length) {
      document.title = titleSuffix
    } else {
      if (activeItem?.path === activePath) {
        document.title = `${activeItem?.title} - ${titleSuffix}`
      } else {
        // find the child that matches the active path
        const item = activeItem?.children?.find(
          (i) => i.type === "link" && i.path === activePath
        ) as Sidebar.SidebarItemLink
        if (item) {
          document.title = `${item.title} - ${titleSuffix}`
        } else {
          document.title = titleSuffix
        }
      }
    }
  }, [activePath, displayedArea, activeItem])

  return (
    <PageTitleContext.Provider value={null}>
      {children}
    </PageTitleContext.Provider>
  )
}

export default PageTitleProvider
