import { FindOptionsWhere } from "typeorm"
import { ProductCategory } from "../../models"
import { isDefined } from "medusa-core-utils"

export const categoryMatchesScope = (
  category: ProductCategory,
  query: FindOptionsWhere<ProductCategory>
): boolean => {
  const scopeActive = isDefined(query.is_active)
  const scopePublic = isDefined(query.is_internal)
  const scopeActiveAndPublic = scopeActive && scopePublic

  if (scopeActiveAndPublic) {
    return (
      category.is_internal === query.is_internal &&
      category.is_active === query.is_active
    )
  } else if (scopeActive) {
    return category.is_active === query.is_active
  } else if (scopePublic) {
    return category.is_internal === query.is_internal
  } else {
    return true
  }
}

export const fetchCategoryDescendantsIds = (
  productCategory: ProductCategory,
  query: FindOptionsWhere<ProductCategory>
) => {
  let result = [productCategory.id]

  ;(productCategory.category_children || []).forEach((child) => {
    if (categoryMatchesScope(child, query)) {
      result = result.concat(fetchCategoryDescendantsIds(child, query))
    }
  })

  return result
}
