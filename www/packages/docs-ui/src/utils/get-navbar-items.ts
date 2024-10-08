import { NavigationDropdownItem } from "types"
import { navDropdownItemsV1, navDropdownItemsV2 } from ".."

type Options = {
  basePath: string
  activePath: string
  version?: "v1" | "v2"
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
