"use client"

import React from "react"
import { NavigationItemLink } from "types"
import { LinkButton } from "../../../LinkButton"
import clsx from "clsx"

type MainNavItemLinkProps = {
  item: NavigationItemLink
  isActive: boolean
  icon?: React.ReactNode
  className?: string
}

export const MainNavItemLink = ({
  item,
  isActive,
  icon,
  className,
}: MainNavItemLinkProps) => {
  return (
    <LinkButton
      href={item.link}
      className={clsx(
        "hover:bg-medusa-button-transparent-hover",
        "rounded-docs_sm px-docs_0.5 py-docs_0.25",
        className
      )}
      variant={isActive ? "base" : "subtle"}
    >
      {item.title}
      {icon}
    </LinkButton>
  )
}
