import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useShippingOptionTypeTableFilters = () => {
  const { t } = useTranslation()

  let filters: Filter[] = []

  filters.push({
    key: "name",
    label: t("fields.label"),
    type: "string",
  })

  filters.push({
    key: "name",
    label: t("fields.code"),
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
