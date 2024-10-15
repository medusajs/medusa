"use client"

import {
  formatReportLink,
  getNavDropdownItems,
  MainNavProvider as UiMainNavProvider,
  useIsBrowser,
} from "docs-ui"
import { useMemo } from "react"
import { siteConfig } from "../config/site"

type MainNavProviderProps = {
  children?: React.ReactNode
}

export const MainNavProvider = ({ children }: MainNavProviderProps) => {
  const { isBrowser } = useIsBrowser()
  const navigationDropdownItems = useMemo(
    () =>
      getNavDropdownItems({
        basePath: siteConfig.baseUrl,
      }),
    []
  )

  const reportLink = useMemo(
    () => formatReportLink("UI Docs", isBrowser ? document.title : "", "ui"),
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
