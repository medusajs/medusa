import {
  NotificationContextType,
  NotificationItemType,
  useNotifications,
} from "@/providers"
import React from "react"
import { NotificationItem } from "./Item"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import clsx from "clsx"

export const NotificationContainer = () => {
  const { notifications, removeNotification } =
    useNotifications() as NotificationContextType

  const handleClose = (notification: NotificationItemType) => {
    notification.onClose?.()
    if (notification.id) {
      removeNotification(notification.id)
    }
  }

  const renderFilteredNotifications = (
    condition: (notificaiton: NotificationItemType) => boolean,
    className?: string
  ) => {
    return (
      <TransitionGroup
        className={clsx(
          "flex fixed flex-col gap-docs_0.5 right-0",
          "md:w-auto w-full overflow-y-auto",
          "max-h-[50%] md:max-h-[calc(100vh-57px)]",
          "max-[768px]:max-h-[50%]",
          className
        )}
      >
        {notifications.filter(condition).map((notification) => (
          <CSSTransition
            key={notification.id}
            timeout={200}
            classNames={{
              enter: "animate-slideInRight animate-fast",
              exit: "animate-slideOutRight animate-fast",
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
        "top-0"
      )}
      {renderFilteredNotifications(
        (notification) => notification.placement !== "top",
        "bottom-0"
      )}
    </>
  )
}
