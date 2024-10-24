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
  useSiteConfig,
} from "../.."
import { MainNavEditDate } from "./EditDate"
import { MainNavItems } from "./Items"
import { MedusaIcon } from "../Icons/MedusaLogo"
import { MainNavDesktopMenu } from "./DesktopMenu"
import { SidebarLeftIcon } from "../Icons/SidebarLeft"
import { MainNavMobileMenu } from "./MobileMenu"
import Link from "next/link"
import { MainNavVersion } from "./Version"

type MainNavProps = {
  className?: string
  itemsClassName?: string
}

export const MainNav = ({ className, itemsClassName }: MainNavProps) => {
  const { reportIssueLink, editDate } = useMainNav()
  const { setMobileSidebarOpen, isSidebarShown } = useSidebar()
  const { config } = useSiteConfig()

  return (
    <div
      className={clsx(
        "flex justify-between items-center",
        "px-docs_1 w-full z-20",
        "sticky top-0 bg-medusa-bg-base",
        className
      )}
    >
      <div className="flex items-center gap-docs_1">
        <div className="flex items-center gap-[10px]">
          {isSidebarShown && (
            <Button
              className="lg:hidden my-docs_0.75 !p-[6.5px]"
              variant="transparent-clear"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <SidebarLeftIcon />
            </Button>
          )}
          <Link href={`${config.baseUrl}`}>
            <BorderedIcon
              IconComponent={MedusaIcon}
              iconWrapperClassName="my-[14px]"
            />
          </Link>
        </div>
        <MainNavItems className={itemsClassName} />
      </div>
      <div className="flex items-center gap-docs_0.75 my-docs_0.75">
        <div className="lg:flex items-center gap-docs_0.5 text-medusa-fg-subtle hidden">
          <MainNavVersion />
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
