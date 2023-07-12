import clsx from "clsx"
import Link from "next/link"
import type { LinkProps } from "next/link"

type NavbarLinkProps = {
  href: string
  label: string
  className?: string
} & LinkProps

const NavbarLink = ({ href, label, className }: NavbarLinkProps) => {
  return (
    <Link
      href={href}
      className={clsx(
        "text-label-small-plus text-medusa-text-subtle dark:text-medusa-text-subtle-dark inline-block py-[6px] px-1",
        "hover:text-medusa-text-base dark:hover:text-medusa-text-base-dark",
        className
      )}
    >
      {label}
    </Link>
  )
}

export default NavbarLink
