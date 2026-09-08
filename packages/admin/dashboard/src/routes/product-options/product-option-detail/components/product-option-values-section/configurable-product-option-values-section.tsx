import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useProductOptionValueTableAdapter } from "./product-option-value-table-adapter"

export const ConfigurableProductOptionValuesSection = ({
  productOption,
}: {
  productOption: HttpTypes.AdminProductOption
}) => {
  const { t } = useTranslation()
  const adapter = useProductOptionValueTableAdapter(productOption.id)

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("productOptions.values.header")}
    />
  )
}
