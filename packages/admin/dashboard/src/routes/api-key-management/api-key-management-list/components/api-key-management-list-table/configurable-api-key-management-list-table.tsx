import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useApiKeyTableAdapter } from "./api-key-table-adapter"

export const ConfigurableApiKeyManagementListTable = ({
  keyType,
}: {
  keyType: "secret" | "publishable"
}) => {
  const { t } = useTranslation()
  const adapter = useApiKeyTableAdapter(keyType)

  return (
    <>
      <ConfigurableDataTable
        adapter={adapter}
        heading={
          keyType === "publishable"
            ? t("apiKeyManagement.domain.publishable")
            : t("apiKeyManagement.domain.secret")
        }
        subHeading={
          keyType === "publishable"
            ? t("apiKeyManagement.subtitle.publishable")
            : t("apiKeyManagement.subtitle.secret")
        }
        actions={[{ label: t("actions.create"), to: "create" }]}
      />
      <Outlet />
    </>
  )
}
