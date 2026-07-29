import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useReturnReasonTableAdapter } from "./return-reason-table-adapter"

export const ConfigurableReturnReasonListTable = () => {
  const { t } = useTranslation()
  const adapter = useReturnReasonTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("returnReasons.domain")}
      subHeading={t("returnReasons.subtitle")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
