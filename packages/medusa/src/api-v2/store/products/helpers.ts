import { MedusaContainer } from "@medusajs/types"
import { isPresent } from "@medusajs/utils"
import { refetchEntity } from "../../utils/refetch-entity"
import { StoreGetProductsParamsType } from "./validators"

// For category filters, we only allow showcasing public and active categories
// TODO: This should ideally be done in the middleware, write a generic filter to conditionally
// map these values or normalize the filters to the ones expected by remote query
export function wrapWithCategoryFilters(filters: StoreGetProductsParamsType) {
  const categoriesFilter = isPresent(filters.category_id)
    ? {
        categories: {
          ...filters.category_id,
          is_internal: false,
          is_active: true,
        },
      }
    : {}

  delete filters.category_id

  return {
    ...filters,
    ...categoriesFilter,
  }
}

export const refetchProduct = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("product", idOrFilter, scope, fields)
}
