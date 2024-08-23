import React from "react"

import type { LinkProps as NextLinkProps } from "next/link"
import Link from "next/link"
import clsx from "clsx"

type LinkButtonProps = NextLinkProps & {
  variant?: "base" | "interactive" | "subtle" | "muted"
  className?: string
} & React.AllHTMLAttributes<HTMLAnchorElement>

export const LinkButton = ({
  variant = "base",
  className,
  ...linkProps
}: LinkButtonProps) => {
  return (
    <Link
      {...linkProps}
      className={clsx(
        className,
        "inline-flex justify-center items-center",
        "gap-docs_0.25 rounded-docs_xs",
        "text-compact-small-plus disabled:text-medusa-fg-disabled",
        "focus:shadow-borders-focus no-underline",
        variant === "base" && [
          "text-medusa-fg-base hover:text-medusa-fg-subtle",
          "focus:text-medusa-fg-base",
        ],
        variant === "interactive" && [
          "text-medusa-fg-interactive hover:text-medusa-interactive-hover",
          "focus:text-medusa-fg-interactive",
        ],
        variant === "subtle" && [
          "text-medusa-fg-subtle hover:text-medusa-fg-base",
          "focus:text-medusa-fg-subtle",
        ],
        variant === "muted" && [
          "text-medusa-fg-muted hover:text-medusa-fg-subtle",
          "focus:text-medusa-fg-muted",
        ]
      )}
    />
  )
}
