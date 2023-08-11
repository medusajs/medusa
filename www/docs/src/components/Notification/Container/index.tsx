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
      {renderFilteredNotifications(
        (notification) => notification.placement === "top",
        "tw-flex tw-fixed tw-flex-col tw-gap-0.5 md:tw-right-1 tw-right-0 md:tw-top-1 tw-top-0 tw-z-[400] md:tw-w-auto tw-w-full"
      )}
      {renderFilteredNotifications(
        (notification) => notification.placement !== "top",
        "tw-flex tw-flex-col tw-gap-0.5 tw-fixed md:tw-right-1 tw-right-0 md:tw-bottom-1 tw-bottom-0 tw-z-[400] md:tw-w-auto tw-w-full"
      )}
    </>
  )
}

export default NotificationContainer
