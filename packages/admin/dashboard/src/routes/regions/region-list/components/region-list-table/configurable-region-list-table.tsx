import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useRegionTableAdapter } from "./region-table-adapter"

export const ConfigurableRegionListTable = () => {
  const { t } = useTranslation()
  const adapter = useRegionTableAdapter()

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("regions.domain")}
        subHeading={t("regions.subtitle")}
        actions={[{ label: t("actions.create"), to: "create" }]}
      />
      <Outlet />
    </>
  )
}
