import { NavbarItem, navbarItemsV1, navbarItemsV2 } from ".."

type Options = {
  basePath: string
  activePath: string
  version?: "v1" | "v2"
}

export function getNavbarItems({
  basePath,
  activePath,
  version = "v1",
}: Options): NavbarItem[] {
  const navbarItems = version === "v2" ? navbarItemsV2 : navbarItemsV1
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
      },
    }
  })
}
