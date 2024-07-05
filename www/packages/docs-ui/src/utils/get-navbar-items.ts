import { NavbarLinkProps, navbarItems } from ".."

type Options = {
  basePath: string
  activePath: string
}

export function getNavbarItems({
  basePath,
  activePath,
}: Options): NavbarLinkProps[] {
  return navbarItems.map((item) => ({
    ...item,
    isActive: activePath === item.href,
    href: `${basePath}${item.href}`,
  }))
}
