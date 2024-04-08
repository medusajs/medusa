import { Tabs } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Outlet, useSearchParams } from "react-router-dom"
import { ApiKeyType } from "../common/constants"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

export const ApiKeyManagementList = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const keyType =
    (searchParams.get("keyType") as ApiKeyType | null) ?? ApiKeyType.PUBLISHABLE

  const onTabChange = (keyType: ApiKeyType) => {
    setSearchParams({ keyType })
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Tabs
        value={keyType}
        onValueChange={(tab) => onTabChange(tab as ApiKeyType)}
        className="flex flex-col gap-y-4"
      >
        <Tabs.List>
          <Tabs.Trigger value={ApiKeyType.PUBLISHABLE}>
            {t("apiKeyManagement.list.publishableTab")}
          </Tabs.Trigger>
          <Tabs.Trigger value={ApiKeyType.SECRET}>
            {t("apiKeyManagement.list.secretTab")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={ApiKeyType.PUBLISHABLE}>
          <ApiKeyManagementListTable keyType={ApiKeyType.PUBLISHABLE} />
        </Tabs.Content>
        <Tabs.Content value={ApiKeyType.SECRET}>
          <ApiKeyManagementListTable keyType={ApiKeyType.SECRET} />
        </Tabs.Content>
      </Tabs>
      <Outlet />
    </div>
  )
}
