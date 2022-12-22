import { ReactNode, useCallback } from "react"
import { NavLink, NavLinkProps } from "react-router-dom"

/**
 * @deprecated
 */
export function navigate(path: string | number) {
  if (typeof path === "number") {
    return history.go(path)
  }
  if (window.location.pathname !== path) {
    history.pushState(path, path)
    if (window.location.pathname !== path) {
      window.location.pathname = path
    }
  }
}

/**
 * @deprecated
 */
export type LinkProps = NavLinkProps & {
  to: string | null
  className?: string
  activeClassName?: string
  children?: ReactNode
}

/**
 * @deprecated
 */
export function Link(props: LinkProps) {
  const { to, children, className = "", activeClassName = "", ...attr } = props

  const hidden = typeof to !== "string"
  const classNameFn = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      isActive && activeClassName
        ? `${className} ${activeClassName}`
        : className,
    [className, activeClassName]
  )

  return (
    <NavLink to={to ?? ""} hidden={hidden} className={classNameFn} {...attr}>
      {children}
    </NavLink>
  )
}

/**
 * @deprecated
 */
export const graphql = () => ""

/**
 * @deprecated
 */
export const useStaticQuery = () => ({
  site: {
    siteMetadata: {
      title: `Admin`,
      description: `The best ecommerce software.`,
      author: `@medusajs`,
    },
  },
})
