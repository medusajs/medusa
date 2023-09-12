import React from "react"
import { useTranslation } from "react-i18next"
import PageDescription from "../atoms/page-description"
import Spacer from "../atoms/spacer"

const SettingsOverview: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <div>
      <PageDescription
        title={t("templates-settings", "Settings")}
        subtitle={t(
          "templates-manage-the-settings-for-your-medusa-store",
          "Manage the settings for your Medusa store"
        )}
      />
      <div className="medium:grid-cols-2 gap-x-base gap-y-xsmall grid auto-cols-fr grid-cols-1">
        {children}
      </div>
      <Spacer />
    </div>
  )
}

export default SettingsOverview
