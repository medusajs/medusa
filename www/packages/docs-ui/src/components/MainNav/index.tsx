"use client"

import clsx from "clsx"
import React from "react"
import {
  BorderedIcon,
  Button,
  LinkButton,
  SearchModalOpener,
  useMainNav,
  useSidebar,
} from "../.."
import { MainNavEditDate } from "./EditDate"
import { MainNavItems } from "./Items"
import { MedusaIcon } from "../Icons/MedusaLogo"
import { MainNavDesktopMenu } from "./DesktopMenu"
import { SidebarLeftIcon } from "../Icons/SidebarLeft"
import { MainNavMobileMenu } from "./MobileMenu"

export const MainNav = () => {
  const { reportIssueLink, editDate } = useMainNav()
  const { setMobileSidebarOpen } = useSidebar()

  return (
    <div
      className={clsx(
        "flex justify-between items-center",
        "px-docs_1 w-full z-20",
        "sticky top-0 bg-medusa-bg-base"
      )}
    >
      <div className="flex items-center gap-docs_1">
        <div className="flex items-center gap-[10px]">
          <Button
            className="lg:hidden my-docs_0.75"
            variant="transparent-clear"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <SidebarLeftIcon />
          </Button>
          <BorderedIcon
            IconComponent={MedusaIcon}
            iconWrapperClassName="my-[14px]"
          />
        </div>
        <MainNavItems />
      </div>
      <div className="flex items-center gap-docs_0.75 my-docs_0.75">
        <div className="lg:flex items-center gap-docs_0.5 text-medusa-fg-subtle hidden">
          {editDate && <MainNavEditDate date={editDate} />}
          <LinkButton
            href={reportIssueLink}
            variant="subtle"
            target="_blank"
            className="text-compact-small-plus"
          >
            Report Issue
          </LinkButton>
        </div>
        <div className="flex items-center gap-docs_0.25">
          <SearchModalOpener />
          <MainNavDesktopMenu />
          <MainNavMobileMenu />
        </div>
      </div>
    </div>
  )
}
