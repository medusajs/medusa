"use client"

import clsx from "clsx"
import Link from "next/link"
import type { LinkProps } from "next/link"
import { useNavbar } from "@/providers/navbar"
import { Area } from "@/types/openapi"

type NavbarLinkProps = {
  href: string
  label: string
  className?: string
  activeValue?: Area
} & LinkProps

const NavbarLink = ({
  href,
  label,
  className,
  activeValue,
}: NavbarLinkProps) => {
  const { activeItem } = useNavbar()

  return (
    <Link
      href={href}
      className={clsx(
        activeItem === activeValue &&
          "text-medusa-fg-base dark:text-medusa-fg-base-dark",
        activeItem !== activeValue &&
          "text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
        "text-compact-small-plus inline-block",
        "hover:text-medusa-fg-base dark:hover:text-medusa-fg-base-dark",
        className
      )}
    >
      {label}
    </Link>
  )
}

export default NavbarLink
