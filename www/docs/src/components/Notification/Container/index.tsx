import {
  NotificationItemType,
  useNotifications,
} from "@site/src/providers/NotificationProvider"
import React from "react"
import NotificationItem from "../Item"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import clsx from "clsx"

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  const handleClose = (notification: NotificationItemType) => {
    notification.onClose?.()
    removeNotification(notification.id)
  }

  const renderFilteredNotifications = (
    condition: (notificaiton: NotificationItemType) => boolean
  ) => {
    return (
      <TransitionGroup>
        {notifications.filter(condition).map((notification) => (
          <CSSTransition
            key={notification.id}
            timeout={200}
            classNames={{
              enter: "animate__animated animate__slideInRight animate__fastest",
              exit: "animate__animated animate__slideOutRight animate__fastest",
            }}
          >
            <NotificationItem
              {...notification}
              onClose={() => handleClose(notification)}
              className={clsx(
                notification.className,
                "!tw-relative !tw-top-0 !tw-bottom-0 !tw-right-0"
              )}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }

  return (
    <>
      <div className="tw-flex tw-fixed tw-flex-col tw-gap-0.5 tw-right-1 tw-top-1 tw-z-[400]">
        {renderFilteredNotifications(
          (notification) => notification.placement === "top"
        )}
      </div>
      <div className="tw-flex tw-flex-col tw-gap-0.5 tw-fixed tw-right-1 tw-bottom-1 tw-z-[400]">
        {renderFilteredNotifications(
          (notification) => notification.placement !== "top"
        )}
      </div>
    </>
  )
}

export default NotificationContainer
