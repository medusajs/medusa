/** @type {Partial<import("../types").SidebarItemType>} */
const commonOptions = {
  loaded: true,
  isPathHref: true,
}

/**
 *
 * @param {import("types").SidebarItemType[]} sidebar
 * @returns {import("types").SidebarItemType[]}
 */
export function sidebarAttachHrefCommonOptions(sidebar) {
  return sidebar.map((item) => ({
    ...commonOptions,
    ...item,
    children: sidebarAttachHrefCommonOptions(item.children || []),
  }))
}
