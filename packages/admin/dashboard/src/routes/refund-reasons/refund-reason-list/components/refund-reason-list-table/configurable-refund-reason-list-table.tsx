import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useRefundReasonTableAdapter } from "./refund-reason-table-adapter"

export const ConfigurableRefundReasonListTable = () => {
  const { t } = useTranslation()
  const adapter = useRefundReasonTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("refundReasons.domain")}
      subHeading={t("refundReasons.subtitle")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
