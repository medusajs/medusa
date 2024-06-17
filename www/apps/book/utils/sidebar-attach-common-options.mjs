/** @type {Partial<import("../providers").SidebarItemType>} */
const commonOptions = {
  loaded: true,
  isPathHref: true,
}

/**
 *
 * @param {import("../providers").SidebarItemType[]} sidebar
 * @returns {import("../providers").SidebarItemType[]}
 */
export function sidebarAttachHrefCommonOptions(sidebar) {
  return sidebar.map((item) => ({
    ...commonOptions,
    ...item,
    children: sidebarAttachHrefCommonOptions(item.children || []),
  }))
}
