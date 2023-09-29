import React from "react"
import NextLink from "next/link"
import type { LinkProps as NextLinkProps } from "next/link"
import clsx from "clsx"

export type LinkProps = {
  href?: string
  children?: React.ReactNode
  className?: string
} & Partial<NextLinkProps> &
  React.AllHTMLAttributes<HTMLAnchorElement>

export const Link = ({ href, children, className, ...rest }: LinkProps) => {
  return (
    <NextLink
      href={href || ""}
      {...rest}
      className={clsx(
        "text-medusa-fg-interactive hover:text-medusa-fg-interactive-hover",
        className
      )}
    >
      {children}
    </NextLink>
  )
}
