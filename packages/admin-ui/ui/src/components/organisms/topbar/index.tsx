import React, { useCallback, useState, type MouseEvent } from "react"
import useToggleState from "../../../hooks/use-toggle-state"
import { usePolling } from "../../../providers/polling-provider"
import Button from "../../fundamentals/button"
import HelpCircleIcon from "../../fundamentals/icons/help-circle"
import NotificationBell from "../../molecules/notification-bell"
import SearchBar from "../../molecules/search-bar"
import ActivityDrawer from "../activity-drawer"
import MailDialog from "../help-dialog"

const Topbar: React.FC = () => {
  const {
    state: activityDrawerState,
    toggle: toggleActivityDrawer,
    close: activityDrawerClose,
  } = useToggleState(false)

  const { batchJobs } = usePolling()

  const [showSupportform, setShowSupportForm] = useState(false)

  const onNotificationBellClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()
      toggleActivityDrawer()
    },
    [toggleActivityDrawer]
  )

  return (
    <div className="min-h-topbar max-h-topbar pe-xlarge ps-base bg-grey-0 border-grey-20 flex w-full items-center justify-between border-b">
      <SearchBar />
      <div className="flex items-center">
        <Button
          size="small"
          variant="ghost"
          className="me-3 h-8 w-8"
          onClick={() => setShowSupportForm(!showSupportform)}
        >
          <HelpCircleIcon size={24} />
        </Button>

        <NotificationBell
          onClick={onNotificationBellClick}
          variant={"ghost"}
          hasNotifications={!!batchJobs?.length}
        />
      </div>
      {showSupportform && (
        <MailDialog
          open={showSupportform}
          onClose={() => setShowSupportForm(false)}
        />
      )}
      {activityDrawerState && (
        <ActivityDrawer onDismiss={activityDrawerClose} />
      )}
    </div>
  )
}

export default Topbar
