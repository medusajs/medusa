"use client"

import {
  BarsThree,
  QuestionMarkCircle,
  SidebarLeft,
  TimelineVertical,
} from "@medusajs/icons"
import React, { useRef, useState } from "react"
import {
  Button,
  getOsShortcut,
  Menu,
  useClickOutside,
  useSidebar,
} from "../../.."
import clsx from "clsx"
import { HouseIcon } from "../../Icons/House"
import { MainNavThemeMenu } from "./ThemeMenu"

export const MainNavDesktopMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { setDesktopSidebarOpen } = useSidebar()
  const ref = useRef(null)

  useClickOutside({
    elmRef: ref,
    onClickOutside: () => setIsOpen(false),
  })

  return (
    <div
      className="relative hidden lg:flex justify-center items-center"
      ref={ref}
    >
      <Button
        variant="transparent"
        onClick={() => setIsOpen((prev) => !prev)}
        className="!p-[6.5px]"
      >
        <BarsThree className="text-medusa-fg-subtle" />
      </Button>
      <Menu
        className={clsx(
          "absolute top-[calc(100%+8px)] right-0 min-w-[200px]",
          !isOpen && "hidden"
        )}
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
            type: "link",
            icon: <QuestionMarkCircle />,
            title: "Troubleshooting",
            link: "https://docs.medusajs.com/v2/resources/troubleshooting",
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
              setIsOpen(false)
            },
          },
          {
            type: "divider",
          },
          {
            type: "custom",
            content: <MainNavThemeMenu />,
          },
        ]}
      />
    </div>
  )
}
