import { NavbarItem, legacyNavbarItems, navbarItemsV1, navbarItemsV2 } from ".."

type Options = {
  basePath: string
  activePath: string
  version?: "v1" | "v2" | "legacy"
}

export function getNavbarItems({
  basePath,
  activePath,
  version = "legacy"
}: Options): NavbarItem[] {
  const navbarItems = version === "v2" ? navbarItemsV2 : version === "v1" ? navbarItemsV1 : legacyNavbarItems
  return navbarItems.map((item) => {
    if (item.type === "divider") {
      return item
    }

    return {
      ...item,
      props: {
        ...item.props,
        isActive: activePath === item.props?.href,
        href: `${basePath}${item.props?.href}`,
      }
    }
  })
}
