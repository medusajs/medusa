import { useTranslation } from "react-i18next"
import { Link, Outlet, useLocation } from "react-router-dom"
import { ApiKeyType } from "../common/constants"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

export const ApiKeyManagementList = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const keyType = pathname.includes("secret")
    ? ApiKeyType.SECRET
    : ApiKeyType.PUBLISHABLE

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center">
        <Link
          to="/settings/api-key-management"
          data-state={keyType === ApiKeyType.PUBLISHABLE ? "active" : ""}
          className="txt-compact-small-plus transition-fg text-ui-fg-subtle hover:text-ui-fg-base focus-visible:border-ui-border-interactive focus-visible:!shadow-borders-focus focus-visible:bg-ui-bg-base data-[state=active]:text-ui-fg-base data-[state=active]:bg-ui-bg-base data-[state=active]:shadow-elevation-card-rest inline-flex items-center justify-center rounded-full border border-transparent bg-transparent px-2.5 py-1 outline-none"
        >
          {t("apiKeyManagement.tabs.publishable")}
        </Link>
        <Link
          to="/settings/api-key-management/secret"
          data-state={keyType === ApiKeyType.SECRET ? "active" : ""}
          className="txt-compact-small-plus transition-fg text-ui-fg-subtle hover:text-ui-fg-base focus-visible:border-ui-border-interactive focus-visible:!shadow-borders-focus focus-visible:bg-ui-bg-base data-[state=active]:text-ui-fg-base data-[state=active]:bg-ui-bg-base data-[state=active]:shadow-elevation-card-rest inline-flex items-center justify-center rounded-full border border-transparent bg-transparent px-2.5 py-1 outline-none"
        >
          {t("apiKeyManagement.tabs.secret")}
        </Link>
      </div>
      <ApiKeyManagementListTable keyType={keyType} />
      <Outlet />
    </div>
  )
}
