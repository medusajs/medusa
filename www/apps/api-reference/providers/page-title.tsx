"use client"

import { createContext, useEffect } from "react"
import { capitalize, useSidebar } from "docs-ui"
import { useArea } from "./area"
import { SidebarItemLink } from "types"

const PageTitleContext = createContext(null)

type PageTitleProviderProps = {
  children: React.ReactNode
}

const PageTitleProvider = ({ children }: PageTitleProviderProps) => {
  const { activePath, activeItem } = useSidebar()
  const { area } = useArea()

  useEffect(() => {
    const titleSuffix = `Medusa ${capitalize(area)} API Reference`

    if (!activePath?.length) {
      document.title = titleSuffix
    } else {
      if (activeItem?.path === activePath) {
        document.title = `${activeItem?.title} - ${titleSuffix}`
      } else {
        // find the child that matches the active path
        const item = activeItem?.children?.find(
          (i) => i.type === "link" && i.path === activePath
        ) as SidebarItemLink
        if (item) {
          document.title = `${item.title} - ${titleSuffix}`
        }
      }
    }
  }, [activePath, area, activeItem])

  return (
    <PageTitleContext.Provider value={null}>
      {children}
    </PageTitleContext.Provider>
  )
}

export default PageTitleProvider
