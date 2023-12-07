import { ProductCategory } from "@medusajs/medusa"
import { TFunction } from "i18next"
import { CategoryFormData, CategoryStatus, CategoryVisibility } from "../modals/add-product-category"
export const flattenCategoryTree = (rootCategories) => {
  return rootCategories.reduce((acc, category) => {
    if (category?.category_children.length) {
      acc = acc
        .concat(flattenCategoryTree(category.category_children))
        .concat(category)
    } else {
      acc.push(category)
    }

    return acc
  }, [])
}

export const getAncestors = (targetNode, nodes, acc = []) => {
  let parentCategory = null

  acc.push(targetNode)

  if (targetNode.parent_category_id) {
    parentCategory = nodes.find((n) => n.id === targetNode.parent_category_id)

    acc = getAncestors(parentCategory, nodes, acc)
  }

  if (!parentCategory) {
    return acc.reverse()
  }

  return acc
}

export const getDefaultCategoryValues = (t: TFunction, category?: ProductCategory): CategoryFormData => {
  return {
    name: category?.name || "",
    handle: category?.handle || "",
    description: category?.description || "",
    metadata: {
      entries: Object.entries(category?.metadata || {}).map(
        ([key, value]) => ({
          key,
          value: value as string,
          state: "existing",
        })
      ),
    },
    is_active: {
      value: category?.is_active ? (category?.is_active ? CategoryStatus.Active : CategoryStatus.Inactive) : CategoryStatus.Active,
      label: category?.is_active
        ? t("modals-active", "Public") as string
        : t("modals-inactive", "Inactive") as string,
    },
    is_public: {
      value: category?.is_internal ? (category?.is_internal ? CategoryVisibility.Private : CategoryVisibility.Public) : CategoryVisibility.Public,
      label: category?.is_internal
        ? t("modals-private", "Private") as string
        : t("modals-public", "Public") as string,
    },
  }
}
