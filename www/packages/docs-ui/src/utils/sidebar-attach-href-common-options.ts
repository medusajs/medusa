import { RawSidebarItemType } from "types"

const commonOptions: Partial<RawSidebarItemType> = {
  loaded: true,
  isPathHref: true,
}

export function sidebarAttachHrefCommonOptions(
  sidebar: RawSidebarItemType[]
): RawSidebarItemType[] {
  return sidebar.map((item) => ({
    ...commonOptions,
    ...item,
    children: sidebarAttachHrefCommonOptions(item.children || []),
  }))
}
