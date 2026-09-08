import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useProductOptionTableAdapter } from "./product-option-table-adapter"

export const ConfigurableProductOptionListTable = () => {
  const { t } = useTranslation()
  const adapter = useProductOptionTableAdapter()

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("productOptions.domain")}
        subHeading={t("productOptions.subtitle")}
        actions={[{ label: t("actions.create"), to: "create" }]}
      />
      <Outlet />
    </>
  )
}
