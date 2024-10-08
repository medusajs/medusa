"use client"

import clsx from "clsx"
import React, { useRef, useState } from "react"
import {
  BorderedIcon,
  getOsShortcut,
  useAnalytics,
  useClickOutside,
  useSidebar,
} from "../../../.."
import {
  EllipsisHorizontal,
  SidebarLeft,
  TimelineVertical,
} from "@medusajs/icons"
import { MedusaIcon } from "../../../Icons/MedusaLogo"
import { HouseIcon } from "../../../Icons/House"
import { Menu } from "../../../Menu"

export const SidebarTopMedusaMenu = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const { setDesktopSidebarOpen } = useSidebar()
  const { track } = useAnalytics()
  const ref = useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    setOpenMenu((prev) => !prev)
    if (!openMenu) {
      track("nav_sidebar_open", {
        url: window.location.href,
      })
    }
  }

  useClickOutside({
    elmRef: ref,
    onClickOutside: () => {
      setOpenMenu(false)
    },
  })

  return (
    <div className={clsx("p-docs_0.75", "relative")} ref={ref}>
      <div
        className={clsx(
          "flex justify-between items-center gap-docs_0.5",
          "rounded-docs_sm hover:bg-medusa-bg-subtle-hover cursor-pointer",
          "py-docs_0.125 pl-docs_0.125 pr-docs_0.5"
        )}
        tabIndex={-1}
        onClick={toggleOpen}
      >
        <BorderedIcon IconComponent={MedusaIcon} />
        <span className="text-compact-small-plus text-medusa-fg-base flex-1">
          Medusa Docs
        </span>
        <EllipsisHorizontal className="text-medusa-fg-muted" />
      </div>
      <div
        className={clsx(
          "absolute w-[calc(100%-16px)] bottom-[calc(-100%-40px)]",
          "left-docs_0.5 z-40",
          !openMenu && "hidden"
        )}
      >
        <Menu
          items={[
            {
              type: "link",
              icon: <HouseIcon />,
              title: "Homepage",
              link: "https://medusajs.com",
            },
            {
              type: "link",
              icon: <TimelineVertical />,
              title: "Changelog",
              link: "https://medusajs.com/changelog",
            },
            {
              type: "divider",
            },
            {
              type: "action",
              title: "Hide Sidebar",
              icon: <SidebarLeft />,
              shortcut: `${getOsShortcut()}.`,
              action: () => {
                setDesktopSidebarOpen(false)
                setOpenMenu(false)
              },
            },
          ]}
        />
      </div>
    </div>
  )
}
