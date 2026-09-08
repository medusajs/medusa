import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useProductTagTableAdapter } from "./product-tag-table-adapter"

export const ConfigurableProductTagListTable = () => {
  const { t } = useTranslation()
  const adapter = useProductTagTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("productTags.domain")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
