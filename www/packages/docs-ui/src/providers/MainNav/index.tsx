"use client"

import { usePathname } from "next/navigation"
import React, { createContext, useContext, useMemo } from "react"
import {
  MenuItem,
  NavigationItem,
  NavigationItemDropdown,
  NavigationMenuItem,
} from "types"
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

  const dropdownHasSidebar = (
    items: NavigationMenuItem[],
    sidebarId: string
  ): boolean => {
    return items.some((childItem) => {
      if (childItem.type !== "link" && childItem.type !== "sub-menu") {
        return false
      }

      if (childItem.sidebar_id === sidebarId) {
        return true
      }

      return (
        childItem.type === "sub-menu" &&
        dropdownHasSidebar(childItem.items, sidebarId)
      )
    })
  }

  const getDropdownLinks = (items: NavigationMenuItem[]): string[] => {
    return items.flatMap((childItem) => {
      if (childItem.type === "link") {
        return [childItem.link]
      }

      if (childItem.type !== "sub-menu") {
        return []
      }

      return [
        ...(childItem.link ? [childItem.link] : []),
        ...getDropdownLinks(childItem.items),
      ]
    })
  }

  const activeItemIndex = useMemo(() => {
    // The homepage falls back to showing the first sidebar, which would
    // otherwise activate that sidebar's item.
    if (currentUrl === config.baseUrl.replace(/\/$/, "")) {
      return
    }

    const sidebarId = shownSidebar?.sidebar_id
    if (sidebarId) {
      const index = navItems.findIndex(
        (item) =>
          item.sidebar_id === sidebarId ||
          (item.type === "dropdown" &&
            dropdownHasSidebar(item.children, sidebarId))
      )

      if (index !== -1) {
        return index
      }
    }

    // Items can have overlapping links (for example, `/cloud` and
    // `/cloud/cli`), so the item with the most specific link is the active one.
    let activeIndex: number | undefined
    let activeLinkLength = 0
    navItems.forEach((item, index) => {
      const links = [
        ...(item.link ? [item.link] : []),
        ...(item.type === "dropdown" ? getDropdownLinks(item.children) : []),
      ]

      links.forEach((link) => {
        if (currentUrl.startsWith(link) && link.length > activeLinkLength) {
          activeIndex = index
          activeLinkLength = link.length
        }
      })
    })

    return activeIndex
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
