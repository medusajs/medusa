import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useStockLocations } from "../../../hooks/api/stock-locations"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../lib/table/table-adapters"
import { LocationListTableActions } from "./location-list-table-actions"
// Registers the stock_location_* renderers (address, fulfillment, sales channels).
import "./location-table-renderers"

export function createLocationTableAdapter({
  t,
}: {
  t: TFunction<"translation", undefined>
}): TableAdapter<HttpTypes.AdminStockLocation> {
  return createTableAdapter<HttpTypes.AdminStockLocation>({
    entity: "stock-locations",
    queryPrefix: "loc",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("stockLocations.list.noRecordsMessage"),
        description: t("stockLocations.list.noRecordsMessageEmpty"),
      },
      filtered: {
        heading: t("stockLocations.list.noRecordsMessage"),
        description: t("stockLocations.list.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { stock_locations, count, isError, error, isLoading } =
        useStockLocations({ fields, ...params })
      return { data: stock_locations, count, isLoading, isError, error }
    },
    getRowHref: (row) => `/settings/locations/${row.id}`,
    renderRowActions: (row) => <LocationListTableActions location={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "name",
        "created_at",
        "updated_at",
        "deleted_at",
        "sales_channels.id",
        "address.id",
      ]
      return columns.map((column) => ({
        ...column,
        filter: !ALLOWED_FILTERS.includes(column.field)
          ? { ...column.filter, enabled: false }
          : column.filter,
      }))
    },
  })
}

// eslint-disable-next-line max-len
export function useLocationTableAdapter(): TableAdapter<HttpTypes.AdminStockLocation> {
  const { t } = useTranslation()
  return useMemo(() => createLocationTableAdapter({ t }), [t])
}
