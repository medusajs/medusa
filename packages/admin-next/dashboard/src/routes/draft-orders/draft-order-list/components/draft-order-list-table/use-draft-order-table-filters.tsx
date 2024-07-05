import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"

export const useDraftOrderTableFilters = () => {
  const { t } = useTranslation()

  const filters: Filter[] = [
    {
      type: "select",
      multiple: true,
      key: "status",
      label: t("fields.status"),
      options: [
        {
          label: t("draftOrders.status.open"),
          value: "open",
        },
        {
          label: t("draftOrders.status.completed"),
          value: "completed",
        },
      ],
    },
  ]

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  return [...filters, ...dateFilters]
}
