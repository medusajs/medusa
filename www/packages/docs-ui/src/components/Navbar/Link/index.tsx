"use client"

import React from "react"
import clsx from "clsx"
import { useNavbar } from "@/providers"
import { NextLink, NextLinkProps } from "@/components"

export type NavbarLinkProps = {
  href: string
  label: string
  className?: string
  activeValue?: string
} & NextLinkProps

export const NavbarLink = ({
  href,
  label,
  className,
  activeValue,
}: NavbarLinkProps) => {
  const { activeItem } = useNavbar()

  return (
    <NextLink
      href={href}
      className={clsx(
        activeItem === activeValue && "!text-ui-fg-base",
        activeItem !== activeValue && "!text-ui-fg-subtle",
        "text-compact-small-plus inline-block",
        "hover:!text-ui-fg-base",
        className
      )}
    >
      {label}
    </NextLink>
  )
}
