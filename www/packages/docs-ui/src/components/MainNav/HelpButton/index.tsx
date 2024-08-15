"use client"

import React, { useRef, useState } from "react"
import { Button, Kbd, Tooltip } from "@/components"
import { Bug, Discord, QuestionMark } from "@medusajs/icons"
import { Menu, useClickOutside } from "../../.."
import { MenuItem } from "types"
import clsx from "clsx"
import { GithubIcon } from "../../Icons/Github"

export const MainNavHelpButton = () => {
  const [showMenu, setShowMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside({
    elmRef: ref,
    onClickOutside: () => {
      setShowMenu(false)
    },
  })

  const menuItems: MenuItem[] = [
    {
      type: "link",
      title: "Create a GitHub Issue",
      link: "https://github.com/medusajs/medusa/issues/new/choose",
      icon: <GithubIcon className="text-medusa-fg-base" />,
    },
    {
      type: "link",
      title: "Get Support on Discord",
      link: "https://discord.gg/medusajs",
      icon: <Discord />,
    },
    {
      type: "divider",
    },
    {
      type: "link",
      title: "Troubleshooting Guides",
      link: "https://docs.medusajs.com/v2/resources/troubleshooting",
      icon: <Bug />,
    },
  ]

  return (
    <div className="relative" ref={ref}>
      <Tooltip
        tooltipChildren={
          <span className="flex gap-[6px]">
            <span>Need help?</span>
            <Kbd>?</Kbd>
          </span>
        }
        place="bottom"
        hidden={showMenu}
      >
        <Button
          variant="transparent-clear"
          className="text-medusa-fg-muted"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <QuestionMark />
        </Button>
      </Tooltip>
      <div
        className={clsx(
          "absolute bottom-0 left-0",
          "z-50 -translate-x-1/2 translate-y-[calc(100%+8px)]",
          !showMenu && "hidden"
        )}
      >
        <Menu items={menuItems} className="w-[200px]" />
      </div>
    </div>
  )
}
