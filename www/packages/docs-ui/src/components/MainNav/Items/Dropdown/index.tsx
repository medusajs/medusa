"use client"

import { TriangleDownMini } from "@medusajs/icons"
import clsx from "clsx"
import React, { useRef, useState } from "react"
import { NavigationItemDropdown } from "types"
import { Menu } from "../../../Menu"
import { MainNavItemLink } from "../Link"

type MainNavItemDropdownProps = {
  item: NavigationItemDropdown
  isActive: boolean
  className?: string
  wrapperClassName?: string
}

export const MainNavItemDropdown = ({
  item,
  isActive,
  className,
  wrapperClassName,
}: MainNavItemDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const getItemContent = () => {
    if (item.link) {
      return (
        <MainNavItemLink
          item={{
            ...item,
            link: item.link!,
            type: "link",
          }}
          isActive={isActive}
          icon={
            <TriangleDownMini
              className={clsx(
                "transition-transform",
                isOpen && "rotate-180",
                isActive && "text-medusa-fg-base hover:text-medusa-fg-subtle",
                !isActive && "text-medusa-fg-subtle hover:text-medusa-fg-base"
              )}
            />
          }
          className="!flex"
        />
      )
    }

    return (
      <div
        className={clsx(
          "cursor-pointer flex gap-docs_0.25 items-center py-docs_0.25",
          isActive && "text-medusa-fg-base hover:text-medusa-fg-subtle",
          !isActive && [
            "text-medusa-fg-subtle hover:text-medusa-fg-base",
            isOpen && "text-medusa-fg-subtle",
          ],
          "hover:bg-medusa-button-transparent-hover rounded-docs_sm px-docs_0.5",
          className
        )}
        tabIndex={-1}
        data-testid="dropdown-title-wrapper"
      >
        <span className="text-compact-small-plus" data-testid="dropdown-title">
          {item.title}
        </span>
        <TriangleDownMini
          className={clsx(
            "transition-transform",
            isOpen && "rotate-180",
            isActive && "text-medusa-fg-base hover:text-medusa-fg-subtle",
            !isActive && "text-medusa-fg-subtle hover:text-medusa-fg-base"
          )}
          data-testid="triangle-icon"
        />
      </div>
    )
  }

  return (
    <div
      className={clsx("relative z-10", wrapperClassName)}
      ref={ref}
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      data-testid="dropdown-wrapper"
    >
      {getItemContent()}
      <div className="absolute top-full -left-docs_0.75 pt-docs_0.25">
        <Menu
          className={clsx("min-w-[190px]", !isOpen && "hidden")}
          items={item.children}
          itemsOnClick={() => setIsOpen(false)}
        />
      </div>
    </div>
  )
}
