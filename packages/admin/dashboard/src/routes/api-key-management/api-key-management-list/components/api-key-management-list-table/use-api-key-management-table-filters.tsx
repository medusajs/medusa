import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useApiKeyManagementTableFilters = () => {
  const { t } = useTranslation()

  let filters: Filter[] = []

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at", type: "date" },
    { label: t("fields.updatedAt"), key: "updated_at", type: "date" },
    { label: t("fields.revokedAt"), key: "revoked_at", type: "date" },
  ]

  filters = [...filters, ...dateFilters]

  return filters
}
