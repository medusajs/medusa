"use client"

import React from "react"
import {
  getNavDropdownItems,
  MainNavProvider as UiMainNavProvider,
} from "docs-ui"
import { useMemo } from "react"
import { config } from "../config"

type MainNavProviderProps = {
  children?: React.ReactNode
}

export const MainNavProvider = ({ children }: MainNavProviderProps) => {
  const navigationDropdownItems = useMemo(
    () =>
      getNavDropdownItems({
        basePath: config.baseUrl,
      }),
    []
  )

  return (
    <UiMainNavProvider navItems={navigationDropdownItems}>
      {children}
    </UiMainNavProvider>
  )
}
