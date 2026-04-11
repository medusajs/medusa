import { HttpTypes } from "@medusajs/types"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { useOrders } from "../../../../../hooks/api/orders"
import { orderColumnAdapter } from "../../../../../lib/table/entity-adapters"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useRegions, useSalesChannels } from "../../../../../hooks/api"
import { createDataTableFilterHelper, DataTableFilter } from "@medusajs/ui"
import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"

/**
 * Create the order table adapter with all order-specific logic
 */
export function createOrderTableAdapter(): TableAdapter<HttpTypes.AdminOrder> {
  return createTableAdapter<HttpTypes.AdminOrder>({
    entity: "orders",
    queryPrefix: "o",
    pageSize: 20,
    columnAdapter: orderColumnAdapter,

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
              previousQuery?.[previousQuery.length - 1]?.query?.fields
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

const filterHelper = createDataTableFilterHelper<HttpTypes.AdminOrder>()

const useOrderTableFilters = () => {
  const { t } = useTranslation()
  const dateFilters = useDataTableDateFilters()

  const { regions } = useRegions({
    limit: 1000,
    fields: "id,name",
  })

  const { sales_channels } = useSalesChannels({
    limit: 1000,
    fields: "id,name",
  })

  // Until we migrate to the new DataTable component, we can't use `createDataTableFilterHelper` filter structure, since the identifier there is `id`
  // while the deprecated component expects `key`. Will be ready to migrate once SUP-2651 is done
  return useMemo(() => {
    const filters: DataTableFilter[] = [
      filterHelper.accessor("total", {
        label: t("fields.total"),
        type: "number",
      }),
      ...dateFilters,
    ]

    if (regions?.length) {
      filters.push(
        filterHelper.accessor("region_id", {
          label: t("fields.region"),
          type: "multiselect",
          searchable: true,
          options: regions.map((r) => ({
            label: r.name,
            value: r.id,
          })),
        })
      )
    }

    if (sales_channels?.length) {
      filters.push(
        filterHelper.accessor("sales_channel_id", {
          label: t("fields.salesChannel"),
          type: "multiselect",
          searchable: true,
          options: sales_channels.map((s) => ({
            label: s.name,
            value: s.id,
          })),
        })
      )
    }

    // TODO: Add payment and fulfillment status filters when they are properly linked to orders
    // Note: These filters are commented out in the legacy implementation as well

    return filters
  }, [regions, sales_channels, dateFilters, t])
}

/**
 * Hook to get the order table adapter with filters
 */
export function useOrderTableAdapter(): TableAdapter<HttpTypes.AdminOrder> {
  const filters = useOrderTableFilters()
  const adapter = createOrderTableAdapter()

  // Add dynamic filters to the adapter
  return {
    ...adapter,
    filters,
    queryPrefix: "o",
  }
}
