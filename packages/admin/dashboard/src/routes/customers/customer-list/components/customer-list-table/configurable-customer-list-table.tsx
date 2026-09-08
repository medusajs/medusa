import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useCustomerTableAdapter } from "./customer-table-adapter"

export const ConfigurableCustomerListTable = () => {
  const { t } = useTranslation()
  const adapter = useCustomerTableAdapter()

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("customers.domain")}
        actions={[{ label: t("actions.create"), to: "create" }]}
      />
      <Outlet />
    </>
  )
}
