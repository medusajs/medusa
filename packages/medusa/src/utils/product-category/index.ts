import { FindOptionsWhere } from "typeorm"
import { ProductCategory } from "../../models"
import { isDefined } from "medusa-core-utils"

export const categoryMatchesScope = (
  category: ProductCategory,
  query: FindOptionsWhere<ProductCategory>
): boolean => {
  return Object.keys(query ?? {}).every(key => category[key] === query[key])
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
