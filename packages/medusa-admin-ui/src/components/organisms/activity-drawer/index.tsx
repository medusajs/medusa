import React, { useContext, useEffect } from "react"
import { PollingContext } from "../../../context/polling"
import useOutsideClick from "../../../hooks/use-outside-click"
import Spinner from "../../atoms/spinner"
import SadFaceIcon from "../../fundamentals/icons/sad-face-icon"
import SidedMouthFaceIcon from "../../fundamentals/icons/sided-mouth-face"
import BatchJobActivityList from "../batch-jobs-activity-list"

const ActivityDrawer = ({ onDismiss }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { batchJobs, hasPollingError, refetch } = useContext(PollingContext)
  useOutsideClick(onDismiss, ref)

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div
      ref={ref}
      className="bg-grey-0 w-[400px] shadow-dropdown rounded-rounded top-[64px] bottom-2 right-3 rounded overflow-x-hidden fixed flex flex-col"
    >
      <div className="inter-large-semibold pt-7 pl-8 pb-1">Activity</div>

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
  return (
    <div className="p-4 h-full w-full flex flex-col justify-center items-center">
      <SidedMouthFaceIcon size={36} />
      <span className={"mt-4 inter-large-semibold text-grey-90"}>
        It's quite in here...
      </span>
      <span className={"mt-4 text-grey-60 text-center inter-base-regular"}>
        You don't have any notifications at the moment, but once you do they
        will live here.
      </span>
    </div>
  )
}

const ErrorActivityDrawer = () => {
  return (
    <div className="p-4 h-full w-full flex flex-col justify-center items-center">
      <SadFaceIcon size={36} />
      <span className={"mt-4 inter-large-semibold text-grey-90"}>Oh no...</span>
      <span className={"mt-2 text-grey-60 text-center inter-base-regular"}>
        Something went wrong while trying to fetch your notifications - We will
        keep trying!
      </span>

      <div className="flex items-center mt-4">
        <Spinner size={"small"} variant={"secondary"} />
        <span className="ml-2.5">Processing...</span>
      </div>
    </div>
  )
}

export default ActivityDrawer
