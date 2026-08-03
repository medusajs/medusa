import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../components/table/configurable-data-table"
import { useLocationTableAdapter } from "./location-table-adapter"

export const ConfigurableLocationListTable = () => {
  const { t } = useTranslation()
  const adapter = useLocationTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("stockLocations.domain")}
      subHeading={t("stockLocations.list.description")}
      actions={[{ label: t("actions.create"), to: "create" }]}
      layout="fill"
    />
  )
}
