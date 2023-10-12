import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { usePolling } from "../../../providers/polling-provider"
import Spinner from "../../atoms/spinner"
import SadFaceIcon from "../../fundamentals/icons/sad-face-icon"
import SidedMouthFaceIcon from "../../fundamentals/icons/sided-mouth-face"
import BatchJobActivityList from "../batch-jobs-activity-list"

import * as Dialog from "@radix-ui/react-dialog"

const ActivityDrawer = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { batchJobs, hasPollingError, refetch } = usePolling()

  useEffect(() => {
    refetch()
  }, [])

  return (
    <Dialog.Root open onOpenChange={onDismiss}>
      <Dialog.Overlay className="fixed top-0 left-0 right-0 bottom-0 z-50 grid place-items-end">
        <Dialog.Content className="bg-grey-0 shadow-dropdown rounded-rounded fixed top-[64px] bottom-2 right-3 flex w-[400px] flex-col justify-between overflow-y-auto p-8">
          <div>
            <Dialog.Title className="inter-xlarge-semibold mb-1">
              {t("activity-drawer-activity", "Activity")}
            </Dialog.Title>
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
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
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
        <span className="ml-2.5">
          {t("activity-drawer-processing", "Processing...")}
        </span>
      </div>
    </div>
  )
}

export default ActivityDrawer
