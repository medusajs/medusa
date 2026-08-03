import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../components/table/configurable-data-table"
import { useCampaignTableAdapter } from "./campaign-table-adapter"

export const ConfigurableCampaignListTable = () => {
  const { t } = useTranslation()
  const adapter = useCampaignTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("campaigns.domain")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
