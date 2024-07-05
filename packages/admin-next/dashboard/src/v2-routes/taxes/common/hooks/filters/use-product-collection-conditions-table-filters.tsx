import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useProductCollectionConditionsTableFilters = () => {
  const { t } = useTranslation()

  const filters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  return filters
}
