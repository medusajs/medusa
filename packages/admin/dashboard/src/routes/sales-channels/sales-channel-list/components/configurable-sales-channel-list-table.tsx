import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../components/table/configurable-data-table"
import { useSalesChannelTableAdapter } from "./sales-channel-table-adapter"

export const ConfigurableSalesChannelListTable = () => {
  const { t } = useTranslation()
  const adapter = useSalesChannelTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("salesChannels.domain")}
      subHeading={t("salesChannels.subtitle")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
