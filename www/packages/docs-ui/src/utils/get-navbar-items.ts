import { NavigationDropdownItem } from "types"
import {
  NavbarItem,
  navbarItemsV1,
  navbarItemsV2,
  navDropdownItemsV1,
  navDropdownItemsV2,
} from ".."

type Options = {
  basePath: string
  activePath: string
  version?: "v1" | "v2"
}

// TODO remove if not used anymore
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

export function getNavDropdownItems({
  basePath,
  activePath,
  version = "v1",
}: Options): NavigationDropdownItem[] {
  const items = version === "v2" ? navDropdownItemsV2 : navDropdownItemsV1
  return items.map((item) => {
    if (item.type === "divider") {
      return item
    }

    return {
      ...item,
      isActive: activePath === item.path,
      path: `${basePath}${item.path}`,
    }
  })
}
