import { useTranslation } from "react-i18next"
import { Filter } from "../../../components/table/data-table"

export const useDiscountTableFilters = () => {
  const { t } = useTranslation()

  let filters: Filter[] = []

  const isDisabledFilter: Filter = {
    key: "is_disabled",
    label: t("fields.disabled"),
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

  const isDynamicFilter: Filter = {
    key: "is_dynamic",
    label: t("fields.type"),
    type: "select",
    options: [
      {
        label: t("fields.dynamic"),
        value: "true",
      },
      {
        label: t("fields.normal"),
        value: "false",
      },
    ],
  }

  filters = [...filters, isDisabledFilter, isDynamicFilter]

  return filters
}
