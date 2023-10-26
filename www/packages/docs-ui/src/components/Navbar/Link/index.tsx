"use client"

import React, { useMemo } from "react"
import clsx from "clsx"
import { useNavbar } from "@/providers"
import { NextLink, NextLinkProps } from "@/components"

export type NavbarLinkProps = {
  href: string
  label: string
  className?: string
  activeValuePattern?: RegExp
} & NextLinkProps

export const NavbarLink = ({
  href,
  label,
  className,
  activeValuePattern,
}: NavbarLinkProps) => {
  const { activeItem } = useNavbar()

  const isActive = useMemo(() => {
    return activeItem
      ? activeValuePattern
        ? activeValuePattern.test(activeItem)
        : href === activeItem
      : false
  }, [activeItem, href, activeValuePattern])

  return (
    <NextLink
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
    </NextLink>
  )
}
