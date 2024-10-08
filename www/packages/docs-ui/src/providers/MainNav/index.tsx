"use client"

import React, { createContext, useContext, useMemo } from "react"
import {
  BreadcrumbOptions,
  NavigationDropdownItem,
  NavigationDropdownItemLink,
} from "types"

export type MainNavContext = {
  navItems: NavigationDropdownItem[]
  activeItem?: NavigationDropdownItemLink
  reportIssueLink: string
  editDate?: string
  breadcrumbOptions: BreadcrumbOptions
}

const MainNavContext = createContext<MainNavContext | null>(null)

export type MainNavProviderProps = {
  navItems: NavigationDropdownItem[]
  reportIssueLink: string
  editDate?: string
  breadcrumbOptions?: BreadcrumbOptions
  children?: React.ReactNode
}

export const MainNavProvider = ({
  navItems,
  reportIssueLink,
  children,
  editDate,
  breadcrumbOptions = {
    showCategories: true,
  },
}: MainNavProviderProps) => {
  const activeItem = useMemo(
    () =>
      navItems.find(
        (item) => item.type === "link" && item.isActive
      ) as NavigationDropdownItemLink,
    [navItems]
  )

  return (
    <MainNavContext.Provider
      value={{
        navItems,
        activeItem,
        reportIssueLink,
        editDate,
        breadcrumbOptions,
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
