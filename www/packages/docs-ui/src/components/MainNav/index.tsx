"use client"

import clsx from "clsx"
import React from "react"
import { MainNavigationDropdown } from "./NavigationDropdown"
import { MainNavBreadcrumbs } from "./Breadcrumb"
import { Button, SearchModalOpener, useMainNav, useSidebar } from "../.."
import { MainNavColorMode } from "./ColorMode"
import Link from "next/link"
import { MainNavDivider } from "./Divider"
import { MainNavSidebarOpener } from "./SidebarOpener"
import { MainNavHelpButton } from "./HelpButton"
import { SidebarLeftIcon } from "../Icons/SidebarLeft"

export const MainNav = () => {
  const { reportIssueLink } = useMainNav()
  const { setMobileSidebarOpen } = useSidebar()
  return (
    <div
      className={clsx(
        "hidden sm:flex justify-between items-center",
        "px-docs_1 py-docs_0.75 w-full z-20",
        "sticky top-0 bg-medusa-bg-base"
      )}
    >
      <div className="flex items-center gap-docs_0.25">
        <Button
          className="lg:hidden"
          variant="transparent-clear"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <SidebarLeftIcon />
        </Button>
        <MainNavSidebarOpener />
        <MainNavigationDropdown />
        <MainNavBreadcrumbs />
      </div>
      <div className="flex items-center gap-docs_0.25">
        <Link href={reportIssueLink} className="text-medusa-fg-muted">
          Report Issue
        </Link>
        <MainNavDivider />
        <MainNavHelpButton />
        <MainNavColorMode />
        <SearchModalOpener />
      </div>
    </div>
  )
}
