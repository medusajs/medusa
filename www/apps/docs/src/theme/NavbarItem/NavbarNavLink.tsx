import React from "react"
import Link from "@docusaurus/Link"
import useBaseUrl from "@docusaurus/useBaseUrl"
import { isRegexpStringMatch } from "@docusaurus/theme-common"
import type { Props } from "@theme/NavbarItem/NavbarNavLink"

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  prependBaseUrlToHref,
  isDropdownLink,
  ...props
}: Omit<Props, "key">): JSX.Element {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to)
  const activeBaseUrl = useBaseUrl(activeBasePath)
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true })

  // Link content is set through html XOR label
  const linkContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {
        children: <>{label}</>,
      }

  if (href) {
    return (
      <Link
        href={prependBaseUrlToHref ? normalizedHref : href}
        {...props}
        {...linkContentProps}
      />
    )
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) => {
          return activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl)
        },
      })}
      {...props}
      {...linkContentProps}
    />
  )
}
