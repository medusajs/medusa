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
    condition: (notificaiton: NotificationItemType) => boolean,
    className?: string
  ) => {
    return (
      <TransitionGroup className={className}>
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
                "!relative !top-0 !bottom-0 !right-0"
              )}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }

  return (
    <>
      {renderFilteredNotifications(
        (notification) => notification.placement === "top",
        "flex fixed flex-col gap-0.5 right-0 top-0 z-[400] md:w-auto w-full max-h-[calc(100vh-57px)] overflow-y-auto"
      )}
      {renderFilteredNotifications(
        (notification) => notification.placement !== "top",
        "flex flex-col gap-0.5 fixed right-0 bottom-0 z-[400] md:w-auto w-full max-h-[calc(100vh-57px)] overflow-y-auto"
      )}
    </>
  )
}

export default NotificationContainer
