import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { usePromotionTableAdapter } from "./promotion-table-adapter"

export const ConfigurablePromotionListTable = () => {
  const { t } = useTranslation()
  const adapter = usePromotionTableAdapter()

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={t("promotions.domain")}
        actions={[{ label: t("actions.create"), to: "create" }]}
      />
      <Outlet />
    </>
  )
}
