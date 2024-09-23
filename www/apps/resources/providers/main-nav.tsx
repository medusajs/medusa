"use client"

import {
  formatReportLink,
  getNavDropdownItems,
  MainNavProvider as UiMainNavProvider,
  useIsBrowser,
} from "docs-ui"
import { useMemo } from "react"
import { config } from "../config"
import { basePathUrl } from "../utils/base-path-url"
import { usePathname } from "next/navigation"
import { generatedEditDates } from "../generated/edit-dates.mjs"

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
        activePath: basePathUrl(
          pathname.startsWith("/commerce-modules")
            ? "/commerce-modules"
            : undefined
        ),
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

  const editDate = useMemo(
    () =>
      (generatedEditDates as Record<string, string>)[
        `app${pathname.replace(/\/$/, "")}/page.mdx`
      ],
    [pathname]
  )

  return (
    <UiMainNavProvider
      navItems={navigationDropdownItems}
      reportIssueLink={reportLink}
      editDate={editDate}
    >
      {children}
    </UiMainNavProvider>
  )
}
