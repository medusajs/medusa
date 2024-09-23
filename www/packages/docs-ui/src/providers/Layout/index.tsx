"use client"

import React, { createContext, useContext, useMemo } from "react"
import { useSiteConfig } from "../.."
import { usePathname } from "next/navigation"

export type LayoutContextType = {
  showSidebar: boolean
}

const LayoutContext = createContext<LayoutContextType | null>(null)

export type LayoutProviderProps = {
  children: React.ReactNode
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const {
    config: { layoutOptions },
  } = useSiteConfig()
  const pathname = usePathname()

  const showSidebar = useMemo(() => {
    if (!layoutOptions?.length) {
      return true
    }

    const pathLayoutOptions = layoutOptions.find(({ route }) => {
      if (typeof route === "string") {
        return route === pathname
      }

      return route.test(pathname)
    })

    return pathLayoutOptions ? pathLayoutOptions.options.showSidebar : true
  }, [layoutOptions, pathname])

  return (
    <LayoutContext.Provider
      value={{
        showSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext)

  if (!context) {
    throw new Error("useLayout must be used inside a LayoutProvider")
  }

  return context
}
