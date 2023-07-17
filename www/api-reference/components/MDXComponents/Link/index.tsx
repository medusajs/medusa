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
        "text-medusa-text-base hover:text-medusa-text-subtle",
        "dark:text-medusa-text-base-dark dark:hover:text-medusa-text-subtle-dark",
        className
      )}
    >
      {children}
    </NextLink>
  )
}

export default Link
