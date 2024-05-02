import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../../components/table/data-table"

export const useReturnItemTableFilters = () => {
  const { t } = useTranslation()

  const filters: Filter[] = [
    {
      key: "returnable_quantity",
      label: t("orders.returns.returnableQuantityLabel"),
      type: "number",
    },
    {
      key: "refundable_amount",
      label: t("orders.returns.refundableAmountLabel"),
      type: "number",
    },
    {
      key: "created_at",
      label: t("fields.createdAt"),
      type: "date",
    },
    {
      key: "updated_at",
      label: t("fields.updatedAt"),
      type: "date",
    },
  ]

  return filters
}
