import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useCategoryProductTableAdapter } from "./category-product-table-adapter"

export const ConfigurableCategoryProductSection = ({
  category,
}: {
  category: HttpTypes.AdminProductCategory
}) => {
  const { t } = useTranslation()
  const adapter = useCategoryProductTableAdapter(category.id)

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("products.domain")}
      actions={[{ label: t("actions.add"), to: "products" }]}
    />
  )
}
