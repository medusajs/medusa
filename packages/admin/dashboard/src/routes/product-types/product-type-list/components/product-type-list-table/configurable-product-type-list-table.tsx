import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useProductTypeTableAdapter } from "./product-type-table-adapter"

export const ConfigurableProductTypeListTable = () => {
  const { t } = useTranslation()
  const adapter = useProductTypeTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("productTypes.domain")}
      subHeading={t("productTypes.subtitle")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
