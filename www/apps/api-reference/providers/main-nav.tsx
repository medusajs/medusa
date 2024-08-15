"use client"

import {
  formatReportLink,
  getNavDropdownItems,
  MainNavProvider as UiMainNavProvider,
  useIsBrowser,
} from "docs-ui"
import { useMemo } from "react"
import { config } from "../config"
import { usePathname } from "next/navigation"
import basePathUrl from "../utils/base-path-url"

type MainNavProviderProps = {
  children?: React.ReactNode
}

export const MainNavProvider = ({ children }: MainNavProviderProps) => {
  const isBrowser = useIsBrowser()
  const pathname = usePathname()
  const navigationDropdownItems = useMemo(
    () =>
      getNavDropdownItems({
        basePath: config.baseUrl,
        activePath: basePathUrl(pathname),
        version: "v2",
      }),
    [pathname]
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
