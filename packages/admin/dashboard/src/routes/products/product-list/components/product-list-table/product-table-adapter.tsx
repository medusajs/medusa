import { HttpTypes } from "@medusajs/types"
import { useProducts } from "../../../../../hooks/api/products"
import { productColumnAdapter } from "../../../../../lib/table/entity-adapters"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { useProductTableFilters } from "./use-product-table-filters"

// eslint-disable-next-line max-len
export function createProductTableAdapter(): TableAdapter<HttpTypes.AdminProduct> {
  return createTableAdapter<HttpTypes.AdminProduct>({
    entity: "products",
    queryPrefix: "p",
    pageSize: 20,
    columnAdapter: productColumnAdapter,
    useData: (fields, params) => {
      const { products, count, isError, error, isLoading } = useProducts(
        {
          fields,
          ...params,
          is_giftcard: false, // Exclude gift cards from product list
        },
        {
          placeholderData: (previousData, previousQuery: any) => {
            // Only keep placeholder data if the fields haven't changed
            const prevFields =
              previousQuery?.[previousQuery?.length - 1]?.query?.fields
            if (prevFields && prevFields !== fields) {
              // Fields changed, don't use placeholder data
              return undefined
            }
            // Fields are the same, keep previous data for smooth transitions
            return previousData
          },
        }
      )
      return { data: products, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/products/${row.id}`,
  })
}

/**
 * Hook to get the product table adapter with filters
 */
export function useProductTableAdapter(): TableAdapter<HttpTypes.AdminProduct> {
  const filters = useProductTableFilters()
  const adapter = createProductTableAdapter()

  // Add dynamic filters to the adapter
  return {
    ...adapter,
    filters,
  }
}
