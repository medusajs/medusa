"use client"

import clsx from "clsx"
import React from "react"
import { MainNavigationDropdown } from "./NavigationDropdown"
import { MainNavBreadcrumbs } from "./Breadcrumb"
import {
  Button,
  LinkButton,
  SearchModalOpener,
  useMainNav,
  useSidebar,
} from "../.."
import { MainNavColorMode } from "./ColorMode"
import { MainNavDivider } from "./Divider"
import { MainNavSidebarOpener } from "./SidebarOpener"
import { MainNavHelpButton } from "./HelpButton"
import { SidebarLeftIcon } from "../Icons/SidebarLeft"
import { MainNavEditDate } from "./EditDate"

export const MainNav = () => {
  const { reportIssueLink, editDate } = useMainNav()
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
      <div className="flex items-center gap-docs_0.75">
        <div className="flex items-center gap-[6px] text-medusa-fg-muted">
          {editDate && <MainNavEditDate date={editDate} />}
          <LinkButton href={reportIssueLink} variant="muted" target="_blank">
            Report Issue
          </LinkButton>
        </div>
        <MainNavDivider />
        <div className="flex items-center gap-docs_0.25">
          <MainNavHelpButton />
          <MainNavColorMode />
          <SearchModalOpener />
        </div>
      </div>
    </div>
  )
}
