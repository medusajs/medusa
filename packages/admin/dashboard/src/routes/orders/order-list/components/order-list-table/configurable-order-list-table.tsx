import { useTranslation } from "react-i18next"
import { Outlet, useLocation } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useOrderTableAdapter } from "./order-table-adapter"

export const ConfigurableOrderListTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const adapter = useOrderTableAdapter()

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("orders.domain")}
        actions={[
          { label: t("actions.export"), to: `export${location.search}` },
        ]}
      />
      <Outlet />
    </>
  )
}
