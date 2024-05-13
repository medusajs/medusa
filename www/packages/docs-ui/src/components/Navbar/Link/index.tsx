"use client"

import React from "react"
import clsx from "clsx"
import { Badge, BadgeProps, Link, LinkProps } from "@/components"

export type NavbarLinkProps = {
  href: string
  label: string
  className?: string
  activeValuePattern?: RegExp
  isActive?: boolean
  badge?: BadgeProps
} & LinkProps

export const NavbarLink = ({
  href,
  label,
  className,
  isActive,
  badge
}: NavbarLinkProps) => {
  return (
    <Link
      href={href}
      className={clsx(
        isActive && "!text-medusa-fg-base",
        !isActive && "!text-medusa-fg-subtle",
        "text-compact-small-plus inline-block",
        "hover:!text-medusa-fg-base",
        className
      )}
    >
      {label}
      {badge && <Badge {...badge} className={clsx(
        badge.className,
        "ml-docs_0.5"
      )} />}
    </Link>
  )
}
