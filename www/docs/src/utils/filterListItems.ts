import { PropSidebarItem, PropSidebarItemLink } from '@docusaurus/plugin-content-docs'

export default function filterListItems (items: PropSidebarItemLink[], pathPattern: string | RegExp): PropSidebarItemLink[] {
  if (!items.length) {
    return items
  }

  let pattern = new RegExp(pathPattern)

  return items.filter((item: PropSidebarItemLink) => pattern.test(item.href))
}

/**
 * Flatting a sidebar list moving items from category
 * to links
 */
export function flattenList (items: PropSidebarItem[]): PropSidebarItem[] {
  const newItems = items.map((item: PropSidebarItem) => {
    if (item.type !== 'category') {
      return item
    }

    return item.items
  })

  return newItems.flat()
}