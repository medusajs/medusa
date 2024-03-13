import { useAdminStockLocations } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useReservationTableFilters = () => {
  const { t } = useTranslation()
  const { stock_locations } = useAdminStockLocations({
    limit: 1000,
  })

  const filters: Filter[] = []

  if (stock_locations) {
    const stockLocationFilter: Filter = {
      type: "select",
      options: stock_locations.map((s) => ({
        label: s.name,
        value: s.id,
      })),
      key: "location_id",
      searchable: true,
      label: t("fields.location"),
    }

    filters.push(stockLocationFilter)
  }

  filters.push({
    type: "date",
    key: "created_at",
    label: t("fields.createdAt"),
  })

  return filters
}
