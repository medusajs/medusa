import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useShippingOptionTypeTableAdapter } from "./shipping-option-type-table-adapter"

export const ConfigurableShippingOptionTypeListTable = () => {
  const { t } = useTranslation()
  const adapter = useShippingOptionTypeTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("shippingOptionTypes.domain")}
      subHeading={t("shippingOptionTypes.subtitle")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
