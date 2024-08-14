"use client"

import clsx from "clsx"
import React from "react"
import { MainNavigationDropdown } from "./NavigationDropdown"
import { MainNavBreadcrumbs } from "./Breadcrumb"
import { SearchModalOpener, useMainNav } from "../.."
import { MainNavColorMode } from "./ColorMode"
import Link from "next/link"
import { MainNavDivider } from "./Divider"
import { MainNavSidebarOpener } from "./SidebarOpener"

export const MainNav = () => {
  const { reportIssueLink } = useMainNav()
  return (
    <div
      className={clsx(
        "hidden sm:flex justify-between items-center",
        "px-docs_1 py-docs_0.75 w-full z-10",
        "sticky top-0 bg-medusa-bg-base"
      )}
    >
      <div className="flex items-center gap-docs_0.25">
        <MainNavSidebarOpener />
        <MainNavigationDropdown />
        <MainNavBreadcrumbs />
      </div>
      <div className="flex items-center gap-docs_0.25">
        <Link
          href={reportIssueLink}
          className="text-medusa-fg-muted hover:text-medusa-fg-subtle"
        >
          Report Issue
        </Link>
        <MainNavDivider />
        <MainNavColorMode />
        <SearchModalOpener />
      </div>
    </div>
  )
}
