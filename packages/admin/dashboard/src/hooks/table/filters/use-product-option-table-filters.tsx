import { useTranslation } from "react-i18next"
import { createDataTableFilterHelper } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useDataTableDateFilters } from "../../../components/data-table/helpers/general/use-data-table-date-filters.tsx"
import { useMemo } from "react"

const filterHelper = createDataTableFilterHelper<HttpTypes.AdminProductOption>()

export const useProductOptionTableFilters = () => {
  const { t } = useTranslation()
  const dateFilters = useDataTableDateFilters()

  return useMemo(
    () => [
      filterHelper.accessor("is_exclusive", {
        label: t("fields.type"),
        type: "radio",
        options: [
          {
            label: t("general.exclusive"),
            value: "true",
          },
          {
            label: t("general.global"),
            value: "false",
          },
        ],
      }),
      ...dateFilters,
    ],
    [dateFilters, t]
  )
}
