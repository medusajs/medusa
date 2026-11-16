import { MenuItem, NavigationItem } from "types"
import { navDropdownItems } from ".."

type Options = {
  basePath: string
}

export function getNavDropdownItems({ basePath }: Options): NavigationItem[] {
  return navDropdownItems.map((item) => {
    const newItem = {
      ...item,
    }

    if (newItem.link) {
      newItem.link = `${basePath}${newItem.link}`
    }

    if (newItem.additional_links) {
      newItem.additional_links = newItem.additional_links.map(
        (link) => `${basePath}${link}`
      )
    }

    if (newItem.type === "dropdown") {
      newItem.children = normalizeMenuItems({
        basePath,
        items: newItem.children,
      })
    }

    return newItem
  })
}

export function normalizeMenuItems({
  basePath,
  items,
}: {
  basePath: string
  items: MenuItem[]
}): MenuItem[] {
  return items.map((item) => {
    const newItem = { ...item }
    if (newItem.type !== "link" && newItem.type !== "sub-menu") {
      return newItem
    }

    if (newItem.link) {
      newItem.link = `${basePath}${newItem.link}`
    }

    if (newItem.type === "sub-menu") {
      newItem.items = normalizeMenuItems({
        basePath,
        items: newItem.items,
      })
    }

    return newItem
  })
}
