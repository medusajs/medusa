import { useTranslation } from "react-i18next"
import { Outlet, useLocation } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useProductTableAdapter } from "./product-table-adapter"
import { useProductPermissions } from "../../../../../hooks/use-resource-permissions"

export const ConfigurableProductListTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const adapter = useProductTableAdapter()
  const { canCreate, canUpdate } = useProductPermissions()

  const actions = [
    { label: t("actions.export"), to: `export${location.search}` },
    ...(canCreate ? [{ label: t("actions.create"), to: "create" }] : []),
    ...(canCreate && canUpdate
      ? [{ label: t("actions.import"), to: `import${location.search}` }]
      : []),
  ]

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("products.domain")}
        actions={actions}
      />
      <Outlet />
    </>
  )
}
