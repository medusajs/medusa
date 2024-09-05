import { AdminProductCategoryResponse } from "@medusajs/types"
import { TFunction } from "i18next"

import { CategoryTreeItem } from "./types"

export function getIsActiveProps(
  isActive: boolean,
  t: TFunction
): { color: "green" | "red"; label: string } {
  switch (isActive) {
    case true:
      return {
        label: t("categories.fields.status.active"),
        color: "green",
      }
    case false:
      return {
        label: t("categories.fields.status.inactive"),
        color: "red",
      }
  }
}

export function getIsInternalProps(
  isInternal: boolean,
  t: TFunction
): { color: "blue" | "green"; label: string } {
  switch (isInternal) {
    case true:
      return {
        label: t("categories.fields.visibility.internal"),
        color: "blue",
      }
    case false:
      return {
        label: t("categories.fields.visibility.public"),
        color: "green",
      }
  }
}

type ChipProps = {
  id: string
  name: string
}

export function getCategoryPath(
  category?: AdminProductCategoryResponse["product_category"]
): ChipProps[] {
  if (!category) {
    return []
  }

  const path = category.parent_category
    ? getCategoryPath(category.parent_category)
    : []
  path.push({ id: category.id, name: category.name })

  return path
}

export function getCategoryChildren(
  category?: AdminProductCategoryResponse["product_category"]
): ChipProps[] {
  if (!category || !category.category_children) {
    return []
  }

  return category.category_children.map((child) => ({
    id: child.id,
    name: child.name,
  }))
}

export const insertCategoryTreeItem = (
  categories: CategoryTreeItem[],
  newItem: CategoryTreeItem
): CategoryTreeItem[] => {
  const seen = new Set<string>()

  const remove = (
    items: CategoryTreeItem[],
    id: string
  ): CategoryTreeItem[] => {
    const stack = [...items]
    const result: CategoryTreeItem[] = []

    while (stack.length > 0) {
      const item = stack.pop()!
      if (item.id !== id) {
        if (item.category_children) {
          item.category_children = remove(item.category_children, id)
        }
        result.push(item)
      }
    }

    return result
  }

  const insert = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
    const stack = [...items]

    while (stack.length > 0) {
      const item = stack.pop()!
      if (seen.has(item.id)) {
        continue // Prevent revisiting the same node
      }
      seen.add(item.id)

      if (item.id === newItem.parent_category_id) {
        if (!item.category_children) {
          item.category_children = []
        }

        if (newItem.rank === null) {
          item.category_children.push(newItem)
        } else {
          item.category_children.splice(newItem.rank, 0, newItem)
        }

        item.category_children.forEach((child, index) => {
          child.rank = index
        })

        item.category_children.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
        return categories
      }
      if (item.category_children) {
        stack.push(...item.category_children)
      }
    }
    return items
  }

  categories = remove(categories, newItem.id)

  if (newItem.parent_category_id === null && newItem.rank === null) {
    categories.unshift(newItem)

    categories.forEach((child, index) => {
      child.rank = index
    })
  } else if (newItem.parent_category_id === null && newItem.rank !== null) {
    categories.splice(newItem.rank, 0, newItem)

    categories.forEach((child, index) => {
      child.rank = index
    })
  } else {
    categories = insert(categories)
  }

  categories.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  return categories
}
