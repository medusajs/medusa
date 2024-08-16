/** @type {Partial<import("../types").RawSidebarItem>} */
const commonOptions = {
  loaded: true,
  isPathHref: true,
}

/**
 *
 * @param {import("types").RawSidebarItem[]} sidebar
 * @returns {import("types").RawSidebarItem[]}
 */
export function sidebarAttachHrefCommonOptions(sidebar) {
  return sidebar.map((item) => {
    if (item.type === "separator") {
      return item
    }

    return {
      ...commonOptions,
      ...item,
      children: sidebarAttachHrefCommonOptions(item.children || []),
    }
  })
}
