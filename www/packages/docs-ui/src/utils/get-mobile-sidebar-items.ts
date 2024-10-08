import { SidebarItem } from "types"
import { mobileSidebarItemsV1, mobileSidebarItemsV2 } from ".."

type Options = {
  baseUrl: string
  version?: "v1" | "v2"
}

export function getMobileSidebarItems({
  baseUrl,
  version = "v1",
}: Options): SidebarItem[] {
  const mobileItems =
    version === "v2" ? mobileSidebarItemsV2 : mobileSidebarItemsV1
  return mobileItems.map((item) => {
    if (item.type !== "link") {
      return item
    }

    return {
      ...item,
      path: `${baseUrl}${item.path}`,
    }
  })
}
