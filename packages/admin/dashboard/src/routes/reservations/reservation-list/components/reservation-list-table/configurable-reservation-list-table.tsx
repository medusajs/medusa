import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useReservationTableAdapter } from "./reservation-table-adapter"

export const ConfigurableReservationListTable = () => {
  const { t } = useTranslation()
  const adapter = useReservationTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("reservations.domain")}
      subHeading={t("reservations.subtitle")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
