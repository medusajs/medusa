import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useProductOptionTableAdapter } from "./product-option-table-adapter"
import { useResourcePermissions } from "../../../../../hooks/use-resource-permissions"

export const ConfigurableProductOptionListTable = () => {
  const { t } = useTranslation()
  const adapter = useProductOptionTableAdapter()
  const { canCreate } = useResourcePermissions("product_option")

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("productOptions.domain")}
        subHeading={t("productOptions.subtitle")}
        actions={
          canCreate ? [{ label: t("actions.create"), to: "create" }] : []
        }
      />
      <Outlet />
    </>
  )
}
