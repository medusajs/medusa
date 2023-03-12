import { FindOptionsWhere } from "typeorm"
import { ProductCategory } from "../../models"
import { isDefined } from "medusa-core-utils"

export const categoryMatchesScope = (
  category: ProductCategory,
  query: FindOptionsWhere<ProductCategory>
): boolean => {
  if (isDefined(query.is_active) && isDefined(query.is_internal)) {
    return (
      category.is_internal === query.is_internal &&
      category.is_active === query.is_active
    )
  } else if (isDefined(query.is_active)) {
    return category.is_active === query.is_active
  } else if (isDefined(query.is_internal)) {
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
