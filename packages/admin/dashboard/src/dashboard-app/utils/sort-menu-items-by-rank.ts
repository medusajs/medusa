import { INavItem } from "../../components/layout/nav-item"

/**
 * Sort menu items by rank in ascending order.
 * Items with rank come first, sorted by rank value.
 * Items without rank come last, maintaining their original order.
 * Recursively sorts nested items independently.
 */
export function sortMenuItemsByRank(
  items: (INavItem & { rank?: number })[]
): INavItem[] {
  // Sort items by rank (ascending order)
  // Items with rank come first, sorted by rank value
  // Items without rank come last, maintaining their original order
  const sortedItems = items.sort((a, b) => {
    // If both have rank, sort by rank value
    if (a.rank !== undefined && b.rank !== undefined) {
      return a.rank - b.rank
    }
    // If only a has rank, it comes first
    if (a.rank !== undefined) {
      return -1
    }
    // If only b has rank, it comes first
    if (b.rank !== undefined) {
      return 1
    }
    // If neither has rank, maintain original order
    return 0
  })

  // Recursively sort nested items
  sortedItems.forEach((item) => {
    if (item.items && item.items.length > 0) {
      item.items = sortMenuItemsByRank(
        item.items as (INavItem & { rank?: number })[]
      )
    }
  })

  return sortedItems
}

