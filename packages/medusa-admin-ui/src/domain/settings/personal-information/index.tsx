import { useAdminGetSession } from "medusa-react"
import React from "react"
import BackButton from "../../../components/atoms/back-button"
import { useFeatureFlag } from "../../../context/feature-flag"
import EditUserInformation from "./edit-user-information"
import UsageInsights from "./usage-insights"

const PersonalInformation = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { user } = useAdminGetSession()

  return (
    <div>
      <BackButton
        label="Back to Settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="bg-white flex flex-col rounded-rounded border border-grey-20 pt-large pb-xlarge px-xlarge gap-y-xlarge large:max-w-[50%]">
        <div className="flex flex-col gap-y-2xsmall">
          <h1 className="inter-xlarge-semibold">Personal information</h1>
          <p className="inter-base-regular text-grey-50">
            Manage your Medusa profile
          </p>
        </div>
        <div className="flex flex-col">
          <div className="border-t border-grey-20 py-xlarge">
            <EditUserInformation user={user} />
          </div>
          {isFeatureEnabled("analytics") && (
            <div className="border-t border-grey-20 py-xlarge">
              <UsageInsights user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInformation
