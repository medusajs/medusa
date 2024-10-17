import React from "react"
import NextLink from "next/link"
import type { LinkProps as NextLinkProps } from "next/link"
import clsx from "clsx"
import { TriangleRightMini } from "@medusajs/icons"

export type LinkProps = {
  href?: string
  children?: React.ReactNode
  className?: string
  target?: string
  rel?: string
  withIcon?: boolean
} & Partial<NextLinkProps>

export const Link = ({
  href,
  children,
  className,
  withIcon = false,
  ...rest
}: LinkProps) => {
  if (href?.replace(/#.*$/, "").endsWith("page.mdx")) {
    href = href.replace("/page.mdx", "")
  }
  return (
    <NextLink
      href={href || ""}
      {...rest}
      className={clsx(
        "text-medusa-fg-interactive hover:text-medusa-fg-interactive-hover",
        withIcon && "flex gap-0.25 items-center group",
        className
      )}
    >
      {children}
      {withIcon && (
        <TriangleRightMini className="group-hover:translate-x-docs_0.125 transition-transform" />
      )}
    </NextLink>
  )
}
