"use client"

import React, { createContext, useContext, useMemo, useState } from "react"
import { NavigationDropdownItem } from "types"

export type MainNavContext = {
  navItems: NavigationDropdownItem[]
  activeItem?: NavigationDropdownItem
  reportIssueLink: string
}

const MainNavContext = createContext<MainNavContext | null>(null)

export type MainNavProviderProps = {
  navItems: NavigationDropdownItem[]
  reportIssueLink: string
  children?: React.ReactNode
}

export const MainNavProvider = ({
  navItems: initialItems,
  reportIssueLink,
  children,
}: MainNavProviderProps) => {
  const [navItems, setNavItems] = useState(initialItems)
  const activeItem = useMemo(
    () => navItems.find((item) => item.type === "link" && item.isActive),
    [navItems]
  )

  return (
    <MainNavContext.Provider
      value={{
        navItems,
        activeItem,
        reportIssueLink,
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
