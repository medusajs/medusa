import { useTranslation } from "react-i18next"
import { Outlet, useLocation } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { usePermissions } from "../../../../../providers/permissions-provider"
import { useProductTableAdapter } from "./product-table-adapter"

export const ConfigurableProductListTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const adapter = useProductTableAdapter()
  const { hasPermission } = usePermissions()

  const canCreate = hasPermission("product:create")

  const actions = [
    { label: t("actions.export"), to: `export${location.search}` },
    ...(canCreate
      ? [
          { label: t("actions.import"), to: `import${location.search}` },
          { label: t("actions.create"), to: "create" },
        ]
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
