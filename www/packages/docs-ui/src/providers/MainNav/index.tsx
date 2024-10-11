"use client"

import { usePathname } from "next/navigation"
import React, { createContext, useContext, useMemo } from "react"
import { NavigationItem } from "types"
import { useSiteConfig } from "../SiteConifg"

export type MainNavContext = {
  navItems: NavigationItem[]
  activeItemIndex?: number
  activeItem?: NavigationItem
  reportIssueLink: string
  editDate?: string
}

const MainNavContext = createContext<MainNavContext | null>(null)

export type MainNavProviderProps = {
  navItems: NavigationItem[]
  reportIssueLink: string
  editDate?: string
  children?: React.ReactNode
}

export const MainNavProvider = ({
  navItems,
  reportIssueLink,
  children,
  editDate,
}: MainNavProviderProps) => {
  const pathname = usePathname()
  const { config } = useSiteConfig()

  const baseUrl = `${config.baseUrl}${config.basePath}`

  const activeItemIndex = useMemo(() => {
    const currentUrl = `${baseUrl}${pathname}`.replace(/\/$/, "")

    let fallbackIndex: number | undefined

    const index = navItems.findIndex((item, index) => {
      if (item.type === "dropdown") {
        return item.children.some((childItem) => {
          if (childItem.type !== "link") {
            return
          }

          const isItemActive = currentUrl.startsWith(childItem.link)

          if (
            isItemActive &&
            childItem.useAsFallback &&
            fallbackIndex === undefined
          ) {
            fallbackIndex = index
            return false
          }

          return isItemActive
        })
      }

      if (item.project && item.project !== config.project.key) {
        return false
      }

      const isItemActive = currentUrl.startsWith(item.path)

      if (isItemActive && item.useAsFallback && fallbackIndex === undefined) {
        fallbackIndex = index
        return false
      }

      return isItemActive
    })

    return index !== -1 ? index : fallbackIndex
  }, [navItems, pathname, baseUrl, config])

  const activeItem = useMemo(() => {
    if (activeItemIndex === undefined) {
      return
    }

    return navItems[activeItemIndex]
  }, [navItems, activeItemIndex])

  return (
    <MainNavContext.Provider
      value={{
        navItems,
        activeItemIndex,
        reportIssueLink,
        editDate,
        activeItem,
      }}
    >
      {children}
    </MainNavContext.Provider>
  )
}

export const useMainNav = () => {
  const context = useContext(MainNavContext)

  if (!context) {
    throw new Error("useMainNav must be used within a MainNavProvider")
  }

  return context
}
