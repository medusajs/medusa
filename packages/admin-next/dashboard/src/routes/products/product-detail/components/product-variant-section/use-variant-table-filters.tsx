import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useProductVariantTableFilters = () => {
  const { t } = useTranslation()

  let filters: Filter[] = []

  const manageInventoryFilter: Filter = {
    key: "manage_inventory",
    label: t("fields.managedInventory"),
    type: "select",
    options: [
      {
        label: t("fields.true"),
        value: "true",
      },
      {
        label: t("fields.false"),
        value: "false",
      },
    ],
  }

  const allowBackorderFilter: Filter = {
    key: "allow_backorder",
    label: t("fields.allowBackorder"),
    type: "select",
    options: [
      {
        label: t("fields.true"),
        value: "true",
      },
      {
        label: t("fields.false"),
        value: "false",
      },
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

  filters = [
    ...filters,
    manageInventoryFilter,
    allowBackorderFilter,
    ...dateFilters,
  ]

  return filters
}
