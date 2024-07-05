import { useTranslation } from "react-i18next"
import { Filter } from "../../../components/table/data-table"

export const useShippingOptionTableFilters = () => {
  const { t } = useTranslation()

  const isReturnFilter: Filter = {
    key: "is_return",
    label: t("fields.type"),
    type: "select",
    options: [
      { label: t("regions.return"), value: "true" },
      { label: t("regions.outbound"), value: "false" },
    ],
  }

  const isAdminFilter: Filter = {
    key: "admin_only",
    label: t("fields.availability"),
    type: "select",
    options: [
      { label: t("general.admin"), value: "true" },
      { label: t("general.store"), value: "false" },
    ],
  }

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  const filters = [isReturnFilter, isAdminFilter, ...dateFilters]

  return filters
}
