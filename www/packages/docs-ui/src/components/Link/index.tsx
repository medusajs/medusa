import React from "react"
import clsx from "clsx"

export type LinkProps = {
  href?: string
  children?: React.ReactNode
  className?: string
} & React.AllHTMLAttributes<HTMLAnchorElement>

export const Link = ({ href, children, className, ...rest }: LinkProps) => {
  return (
    <a
      href={href || ""}
      {...rest}
      className={clsx(
        "text-medusa-fg-interactive hover:text-medusa-fg-interactive-hover",
        className
      )}
    >
      {children}
    </a>
  )
}
