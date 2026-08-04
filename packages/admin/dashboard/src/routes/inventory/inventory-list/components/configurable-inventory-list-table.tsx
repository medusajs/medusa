import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../components/table/configurable-data-table"
import { useInventoryTableAdapter } from "./inventory-table-adapter"

export const ConfigurableInventoryListTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const adapter = useInventoryTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("inventory.domain")}
      subHeading={t("inventory.subtitle")}
      actions={[
        { label: t("actions.export"), to: `export${location.search}` },
        { label: t("actions.create"), to: "create" },
      ]}
    />
  )
}
