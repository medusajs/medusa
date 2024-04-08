import { AdminProductCategoryResponse } from "@medusajs/types"
import { TFunction } from "i18next"

export function getIsActiveProps(
  isActive: boolean,
  t: TFunction
): { color: "green" | "red"; label: string } {
  switch (isActive) {
    case true:
      return {
        label: t("categories.fields.active"),
        color: "green",
      }
    case false:
      return {
        label: t("categories.fields.inactive"),
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
        label: t("categories.fields.internal"),
        color: "blue",
      }
    case false:
      return {
        label: t("categories.fields.public"),
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
