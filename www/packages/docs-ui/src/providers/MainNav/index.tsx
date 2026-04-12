"use client"

import { usePathname } from "next/navigation"
import React, { createContext, useContext, useMemo } from "react"
import { MenuItem, NavigationItem, NavigationItemDropdown } from "types"
import { useSiteConfig } from "../SiteConfig"
import { useSidebar } from "../Sidebar"

export type MainNavContext = {
  navItems: NavigationItem[]
  activeItemIndex?: number
  activeItem?: NavigationItem
  editDate?: string
  logo?: React.ReactNode
  logoUrl?: string
  helpNavItem?: NavigationItemDropdown
  additionalMenuItems?: MenuItem[]
}

const MainNavContext = createContext<MainNavContext | null>(null)

export type MainNavProviderProps = {
  navItems: NavigationItem[]
  logo?: React.ReactNode
  logoUrl?: string
  children?: React.ReactNode
  helpNavItem?: NavigationItemDropdown
  additionalMenuItems?: MenuItem[]
}

export const MainNavProvider = ({
  navItems,
  logo,
  logoUrl,
  helpNavItem,
  children,
  additionalMenuItems,
}: MainNavProviderProps) => {
  const pathname = usePathname()
  const { shownSidebar } = useSidebar()
  const { config } = useSiteConfig()
  const currentUrl = useMemo(() => {
    return `${config.baseUrl}${config.basePath}${pathname}`.replace(/\/$/, "")
  }, [pathname, config.baseUrl, config.basePath])

  const dropdownHasActiveItem = (
    items: NavigationItemDropdown["children"]
  ): boolean => {
    return items.some((childItem) => {
      if (childItem.type !== "link" && childItem.type !== "sub-menu") {
        return false
      }

      if (
        childItem.sidebar_id &&
        shownSidebar?.sidebar_id === childItem.sidebar_id
      ) {
        return true
      }

      if (childItem.type === "sub-menu") {
        return dropdownHasActiveItem(childItem.items)
      }

      return currentUrl.startsWith(childItem.link)
    })
  }

  const activeItemIndex = useMemo(() => {
    const index = navItems.findIndex((item) => {
      if (item.sidebar_id && shownSidebar?.sidebar_id === item.sidebar_id) {
        return true
      }

      let isItemActive = false

      if (item.link) {
        isItemActive = currentUrl.startsWith(item.link)
      }

      if (item.type === "dropdown" && !isItemActive) {
        isItemActive = dropdownHasActiveItem(item.children)
      }

      return isItemActive
    })

    return index !== -1 ? index : undefined
  }, [navItems, pathname, currentUrl, config, shownSidebar])

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
        activeItem,
        logo,
        logoUrl,
        helpNavItem,
        additionalMenuItems,
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
