"use client"

import clsx from "clsx"
import React, { useMemo } from "react"
import { Button } from "@/components/Button"
import { GITHUB_ISSUES_LINK } from "@/constants"
import { SearchModalOpener } from "@/components/Search/ModalOpener"
import { useLayout } from "@/providers/Layout"
import { useSidebar } from "@/providers/Sidebar"
import { useSiteConfig } from "@/providers/SiteConfig"
import { MainNavItems } from "./Items"
import { MainNavDesktopMenu } from "./DesktopMenu"
import { SidebarLeftIcon } from "../Icons/SidebarLeft"
import { MainNavMobileMenu } from "./MobileMenu"
import Link from "next/link"
import { MainNavVersion } from "./Version"
import { AiAssistantTriggerButton } from "../AiAssistant/TriggerButton"
import { MainNavItemDropdown } from "./Items/Dropdown"
import { ColoredMedusaIcon } from "../Icons"
import { useMainNav } from "../../providers/MainNav"

type MainNavProps = {
  className?: string
  itemsClassName?: string
}

export const MainNav = ({ className, itemsClassName }: MainNavProps) => {
  const { logo, logoUrl, helpNavItem } = useMainNav()
  const { setMobileSidebarOpen, isSidebarShown } = useSidebar()
  const { config, isInProduct } = useSiteConfig()
  const { showCollapsedNavbar } = useLayout()

  const collapseNavbar = useMemo(() => {
    return showCollapsedNavbar && !isInProduct
  }, [showCollapsedNavbar, isInProduct])

  return (
    <div
      className={clsx("w-full z-20 sticky top-0 bg-medusa-bg-base", className)}
      data-testid="main-nav"
    >
      <div
        className={clsx(
          "flex justify-between items-center px-docs_1 w-full gap-docs_0.5",
          "border-b border-medusa-border-base"
        )}
        data-testid="main-nav-content"
      >
        <div className="flex items-center gap-[10px]">
          {isSidebarShown && (
            <Button
              className="lg:hidden my-docs_0.75 !p-[6.5px]"
              variant="transparent-clear"
              onClick={() => setMobileSidebarOpen(true)}
              data-testid="mobile-sidebar-button"
            >
              <SidebarLeftIcon />
            </Button>
          )}
          <Link href={`${logoUrl || config.baseUrl}`} data-testid="logo-link">
            {logo || <ColoredMedusaIcon variant="subtle" />}
          </Link>
        </div>
        {!collapseNavbar && (
          <MainNavItems className={clsx("flex-grow", itemsClassName)} />
        )}
        {!isInProduct && (
          <div
            className={clsx(
              "flex items-center my-docs_0.75",
              collapseNavbar && "flex-grow justify-between"
            )}
            data-testid="main-nav-actions"
          >
            <div className="lg:flex items-center gap-docs_0.25 text-medusa-fg-subtle hidden">
              <MainNavVersion />
              <MainNavItemDropdown
                item={
                  helpNavItem || {
                    type: "dropdown",
                    title: "Help",
                    children: [
                      {
                        type: "link",
                        title: "Troubleshooting",
                        link: "https://docs.medusajs.com/resources/troubleshooting",
                      },
                      {
                        type: "link",
                        title: "Report Issue",
                        link: GITHUB_ISSUES_LINK,
                      },
                      {
                        type: "link",
                        title: "Discord Community",
                        link: "https://discord.gg/medusajs",
                      },
                      {
                        type: "divider",
                      },
                      {
                        type: "link",
                        title: "Contact Sales",
                        link: "https://medusajs.com/contact/",
                      },
                    ],
                  }
                }
                isActive={false}
              />
            </div>
            <div className="flex items-center">
              {config.features?.aiAssistant && <AiAssistantTriggerButton />}
              <SearchModalOpener />
              <MainNavDesktopMenu />
              <MainNavMobileMenu />
            </div>
          </div>
        )}
      </div>
      {collapseNavbar && (
        <div
          className={clsx("border-b border-medusa-border-base px-docs_1")}
          data-testid="collapsed-nav-items"
        >
          <MainNavItems className={clsx("flex-wrap", itemsClassName)} />
        </div>
      )}
    </div>
  )
}
