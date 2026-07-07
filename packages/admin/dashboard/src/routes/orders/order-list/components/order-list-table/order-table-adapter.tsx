import { useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { useOrders } from "../../../../../hooks/api/orders"

/**
 * Create the order table adapter with all order-specific logic
 */
export function createOrderTableAdapter(): TableAdapter<HttpTypes.AdminOrder> {
  return createTableAdapter<HttpTypes.AdminOrder>({
    entity: "orders",
    queryPrefix: "o",
    pageSize: 20,
    transformColumns: (columns) => {
      const ALLOWED_FILTER_FIELDS = [
        "id",
        "status",
        "sales_channel.id",
        "region.id",
        "customer.id",
        "created_at",
        "updated_at",
        "total",
      ]

      const DISABLED_SORTING_PATTERNS = [
        /total/i,
        /payment_status/,
        /fulfillment_status/,
        /customer.id/,
        /region.id/,
        /sales_channel.id/,
      ]

      return columns.map((column) => {
        const isFilterDisabled = !ALLOWED_FILTER_FIELDS.includes(column.field)

        const isSortingDisabled = DISABLED_SORTING_PATTERNS.some((pattern) =>
          pattern.test(column.field)
        )

        return {
          ...column,
          filter: isFilterDisabled
            ? { ...column.filter, enabled: false }
            : column.filter,
          sortable: isSortingDisabled ? false : column.sortable,
        }
      })
    },
    useData: (fields, params) => {
      const { orders, count, isError, error, isLoading } = useOrders(
        {
          fields,
          ...params,
        },
        {
          placeholderData: (previousData, previousQuery) => {
            // Only keep placeholder data if the fields haven't changed
            const prevFields =
              // @ts-ignore not sure what the expected type here is
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

      return {
        data: orders,
        count,
        isLoading,
        isError,
        error,
      }
    },

    getRowHref: (row) => `/orders/${row.id}`,

    emptyState: {
      empty: {
        heading: "No orders found",
      },
    },
  })
}

export function useOrderTableAdapter(): TableAdapter<HttpTypes.AdminOrder> {
  return useMemo(() => createOrderTableAdapter(), [])
}
