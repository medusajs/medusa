import { useTranslation } from "react-i18next"
import { HttpTypes } from "@zjedene-medusa/types"

import { Filter } from "../../../components/table/data-table"

export const useShippingOptionTableFilters = (
  locations: HttpTypes.AdminStockLocation[]
) => {
  const { t } = useTranslation()

  const locationFilter: Filter = {
    key: "stock_location_id",
    label: t("fields.location"),
    type: "select",
    options: locations.map((l) => ({ label: l.name, value: l.id })),
  }

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  const filters = [locationFilter, ...dateFilters]

  return filters
}
