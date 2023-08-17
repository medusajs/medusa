import clsx from "clsx"
import NextLink from "next/link"
import type { LinkProps as NextLinkProps } from "next/link"

export type LinkProps = {
  href?: string
  children?: React.ReactNode
  className?: string
} & Partial<NextLinkProps> &
  React.AllHTMLAttributes<HTMLAnchorElement>

const Link = ({ href, children, className, ...rest }: LinkProps) => {
  return (
    <NextLink
      href={href || ""}
      {...rest}
      className={clsx(
        "text-medusa-fg-interactive hover:text-medusa-fg-interactive-hover",
        "dark:text-medusa-fg-interactive-dark dark:hover:text-medusa-fg-interactive-hover-dark",
        className
      )}
    >
      {children}
    </NextLink>
  )
}

export default Link
