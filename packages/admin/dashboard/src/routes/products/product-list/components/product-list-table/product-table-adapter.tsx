import { HttpTypes } from "@medusajs/types"
import { useProducts } from "../../../../../hooks/api/products"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { useMemo } from "react"
import { ProductActions } from "./product-list-table-actions"

// eslint-disable-next-line max-len
export function createProductTableAdapter(): TableAdapter<HttpTypes.AdminProduct> {
  return createTableAdapter<HttpTypes.AdminProduct>({
    entity: "products",
    queryPrefix: "p",
    pageSize: 20,
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
    renderRowActions: (row) => <ProductActions product={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "title",
        "handle",
        "status",
        "external_id",
        "created_at",
        "updated_at",
        "deleted_at",
        "collection.id",
        "type.id",
        "tags.id",
        "categories.id",
        "sales_channels.id",
        "variants.id",
      ]

      return columns.map((column) => {
        const isFilterDisabled = !ALLOWED_FILTERS.includes(column.field)

        return {
          ...column,
          filter: isFilterDisabled
            ? { ...column.filter, enabled: false }
            : column.filter,
        }
      })
    },
  })
}

/**
 * Hook to get the product table adapter with filters
 */
export function useProductTableAdapter(): TableAdapter<HttpTypes.AdminProduct> {
  return useMemo(() => createProductTableAdapter(), [])
}
