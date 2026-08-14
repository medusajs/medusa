import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useShippingProfileTableAdapter } from "./shipping-profile-table-adapter"

export const ConfigurableShippingProfileListTable = () => {
  const { t } = useTranslation()
  const adapter = useShippingProfileTableAdapter()

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("shippingProfile.domain")}
      subHeading={t("shippingProfile.subtitle")}
      actions={[{ label: t("actions.create"), to: "create" }]}
    />
  )
}
