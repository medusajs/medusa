import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

import useOutsideClick from "../../../hooks/use-outside-click"
import { usePolling } from "../../../providers/polling-provider"
import Spinner from "../../atoms/spinner"
import SadFaceIcon from "../../fundamentals/icons/sad-face-icon"
import SidedMouthFaceIcon from "../../fundamentals/icons/sided-mouth-face"
import BatchJobActivityList from "../batch-jobs-activity-list"

const ActivityDrawer = ({ onDismiss }) => {
  const { t } = useTranslation()
  const ref = React.useRef<HTMLDivElement>(null)
  const { batchJobs, hasPollingError, refetch } = usePolling()
  useOutsideClick(onDismiss, ref)

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div
      ref={ref}
      className="bg-grey-0 shadow-dropdown rounded-rounded fixed bottom-2 right-3 top-[64px] z-[1] flex w-[400px] flex-col overflow-x-hidden rounded"
    >
      <div className="inter-large-semibold pb-1 ps-8 pt-7">
        {t("activity-drawer-activity", "Activity")}
      </div>

      {!hasPollingError ? (
        batchJobs ? (
          <BatchJobActivityList batchJobs={batchJobs} />
        ) : (
          <EmptyActivityDrawer />
        )
      ) : (
        <ErrorActivityDrawer />
      )}
    </div>
  )
}

const EmptyActivityDrawer = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <SidedMouthFaceIcon size={36} />
      <span className={"inter-large-semibold text-grey-90 mt-4"}>
        {t("activity-drawer-no-notifications-title", "It's quiet in here...")}
      </span>
      <span className={"text-grey-60 inter-base-regular mt-4 text-center"}>
        {t(
          "activity-drawer-no-notifications-description",
          "You don't have any notifications at the moment, but once you do they will live here."
        )}
      </span>
    </div>
  )
}

const ErrorActivityDrawer = () => {
  const { t } = useTranslation()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <SadFaceIcon size={36} />
      <span className={"inter-large-semibold text-grey-90 mt-4"}>
        {t("activity-drawer-error-title", "Oh no...")}
      </span>
      <span className={"text-grey-60 inter-base-regular mt-2 text-center"}>
        {t(
          "activity-drawer-error-description",
          "Something went wrong while trying to fetch your notifications - We will keep trying!"
        )}
      </span>

      <div className="mt-4 flex items-center">
        <Spinner size={"small"} variant={"secondary"} />
        <span className="ms-2.5">
          {t("activity-drawer-processing", "Processing...")}
        </span>
      </div>
    </div>
  )
}

export default ActivityDrawer
