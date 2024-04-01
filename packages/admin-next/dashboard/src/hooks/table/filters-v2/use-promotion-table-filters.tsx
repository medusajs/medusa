import { useTranslation } from "react-i18next"
import { Filter } from "../../../components/table/data-table"

export const usePromotionTableFilters = () => {
  const { t } = useTranslation()

  let filters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at", type: "date" },
    { label: t("fields.updatedAt"), key: "updated_at", type: "date" },
  ]

  return filters
}
