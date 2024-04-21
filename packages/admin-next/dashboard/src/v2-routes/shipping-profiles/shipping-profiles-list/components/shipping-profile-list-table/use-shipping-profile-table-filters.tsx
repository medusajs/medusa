import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useShippingProfileTableFilters = () => {
  const { t } = useTranslation()

  let filters: Filter[] = []

  filters.push({
    key: "name",
    label: t("fields.name"),
    type: "string",
  })

  filters.push({
    key: "type",
    label: t("fields.type"),
    type: "string",
  })

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  filters = [...filters, ...dateFilters]

  return filters
}
