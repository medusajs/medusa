/** @type {Partial<import("@/types").SidebarItem[]>} */
const commonOptions = {
  loaded: true,
  isPathHref: true,
}

/**
 *
 * @param {import("@/types").SidebarItem[]} sidebar
 * @param {boolean} nested
 * @returns {import("@/types").SidebarItem[]}
 */
export function sidebarAttachHrefCommonOptions(sidebar, nested = false) {
  return sidebar.map((item) => {
    const updatedItem = {
      ...commonOptions,
      ...item,
      children: sidebarAttachHrefCommonOptions(item.children || [], true),
    }

    if (updatedItem.type !== "category" && !nested) {
      updatedItem.childrenSameLevel = true
    }

    return updatedItem
  })
}
