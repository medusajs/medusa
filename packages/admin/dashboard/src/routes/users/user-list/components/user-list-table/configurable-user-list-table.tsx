import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useUserTableAdapter } from "./user-table-adapter"

export const ConfigurableUserListTable = () => {
  const { t } = useTranslation()
  const adapter = useUserTableAdapter()

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("users.domain")}
        actions={[{ label: t("users.invite"), to: "invite" }]}
      />
      <Outlet />
    </>
  )
}
