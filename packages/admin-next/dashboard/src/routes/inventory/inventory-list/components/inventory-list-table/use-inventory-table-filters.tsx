import { useAdminStockLocations } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useInventoryTableFilters = () => {
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
    type: "string",
    key: "material",
    label: t("fields.material"),
  })

  filters.push({
    type: "string",
    key: "sku",
    label: t("fields.sku"),
  })

  filters.push({
    type: "string",
    key: "mid_code",
    label: t("fields.midCode"),
  })

  filters.push({
    type: "number",
    key: "height",
    label: t("fields.height"),
  })

  filters.push({
    type: "number",
    key: "width",
    label: t("fields.width"),
  })

  filters.push({
    type: "number",
    key: "length",
    label: t("fields.length"),
  })

  filters.push({
    type: "number",
    key: "weight",
    label: t("fields.weight"),
  })

  filters.push({
    type: "select",
    options: [
      { label: t("fields.true"), value: "true" },
      { label: t("fields.false"), value: "false" },
    ],
    key: "requires_shipping",
    multiple: false,
    label: t("fields.requiresShipping"),
  })

  return filters
}
