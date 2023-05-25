import { useAdminGetSession } from "medusa-react"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import EditUserInformation from "./edit-user-information"
import UsageInsights from "./usage-insights"

const PersonalInformation = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { user } = useAdminGetSession()
  const { t } = useTranslation()

  return (
    <div>
      <BackButton
        label={t("Back to Settings")}
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="rounded-rounded border-grey-20 pt-large pb-xlarge px-xlarge gap-y-xlarge large:max-w-[50%] flex flex-col border bg-white">
        <div className="gap-y-2xsmall flex flex-col">
          <h1 className="inter-xlarge-semibold">{t("Personal information")}</h1>
          <p className="inter-base-regular text-grey-50">
            {t("Manage your Medusa profile")}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="border-grey-20 py-xlarge border-t">
            <EditUserInformation user={user} />
          </div>
          {isFeatureEnabled("analytics") && (
            <div className="border-grey-20 py-xlarge border-t">
              <UsageInsights user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInformation
