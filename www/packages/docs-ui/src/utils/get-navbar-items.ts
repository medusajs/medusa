import { NavigationItem } from "types"
import { navDropdownItems } from ".."

type Options = {
  basePath: string
}

export function getNavDropdownItems({ basePath }: Options): NavigationItem[] {
  return navDropdownItems.map((item) => {
    const newItem = {
      ...item,
    }

    if (newItem.type === "link") {
      newItem.path = `${basePath}${newItem.path}`
    } else {
      newItem.children = newItem.children.map((childItem) => {
        if (childItem.type !== "link") {
          return childItem
        }

        return {
          ...childItem,
          link: `${basePath}${childItem.link}`,
        }
      })
    }

    return newItem
  })
}
