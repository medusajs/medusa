"use client"

import {
  formatReportLink,
  getNavDropdownItems,
  MainNavProvider as UiMainNavProvider,
  useIsBrowser,
} from "docs-ui"
import { useMemo } from "react"
import { config } from "../config"

type MainNavProviderProps = {
  children?: React.ReactNode
}

export const MainNavProvider = ({ children }: MainNavProviderProps) => {
  const { isBrowser } = useIsBrowser()
  const navigationDropdownItems = useMemo(
    () =>
      getNavDropdownItems({
        basePath: config.baseUrl,
      }),
    []
  )

  const reportLink = useMemo(
    () =>
      formatReportLink(
        config.titleSuffix || "",
        isBrowser ? document.title : ""
      ),
    [isBrowser]
  )

  return (
    <UiMainNavProvider
      navItems={navigationDropdownItems}
      reportIssueLink={reportLink}
    >
      {children}
    </UiMainNavProvider>
  )
}
