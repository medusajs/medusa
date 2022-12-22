import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React, {
  type MouseEvent,
  useCallback,
  useContext,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "../../../context/account"
import { PollingContext } from "../../../context/polling"
import useToggleState from "../../../hooks/use-toggle-state"
import Avatar from "../../atoms/avatar"
import Button from "../../fundamentals/button"
import GearIcon from "../../fundamentals/icons/gear-icon"
import HelpCircleIcon from "../../fundamentals/icons/help-circle"
import SignOutIcon from "../../fundamentals/icons/log-out-icon"
import NotificationBell from "../../molecules/notification-bell"
import SearchBar from "../../molecules/search-bar"
import ActivityDrawer from "../activity-drawer"
import MailDialog from "../help-dialog"

const Topbar: React.FC = () => {
  const navigate = useNavigate()

  const {
    state: activityDrawerState,
    toggle: toggleActivityDrawer,
    close: activityDrawerClose,
  } = useToggleState(false)

  const { first_name, last_name, email, handleLogout } =
    useContext(AccountContext)
  const { batchJobs } = useContext(PollingContext)

  const [showSupportform, setShowSupportForm] = useState(false)

  const logOut = () => {
    handleLogout()
    navigate("/login")
  }

  const onNotificationBellClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()
      toggleActivityDrawer()
    },
    [toggleActivityDrawer]
  )

  return (
    <div className="w-full min-h-topbar max-h-topbar pr-xlarge pl-base bg-grey-0 border-b border-grey-20 sticky top-0 flex items-center justify-between z-40">
      <SearchBar />
      <div className="flex items-center">
        <Button
          size="small"
          variant="ghost"
          className="w-8 h-8 mr-3"
          onClick={() => setShowSupportForm(!showSupportform)}
        >
          <HelpCircleIcon size={24} />
        </Button>

        <NotificationBell
          onClick={onNotificationBellClick}
          variant={"ghost"}
          hasNotifications={!!batchJobs?.length}
        />

        <div className="ml-large w-large h-large">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div className="cursor-pointer w-full h-full">
                <Avatar
                  user={{ first_name, last_name, email }}
                  color="bg-fuschia-40"
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              sideOffset={5}
              className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
            >
              <DropdownMenu.Item className="mb-1 last:mb-0">
                <Button
                  variant="ghost"
                  size="small"
                  className={"w-full justify-start"}
                  onClick={() => navigate("/a/settings")}
                >
                  <GearIcon />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  className={"w-full justify-start text-rose-50"}
                  onClick={() => logOut()}
                >
                  <SignOutIcon size={20} />
                  Sign out
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
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
