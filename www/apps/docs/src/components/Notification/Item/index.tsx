import clsx from "clsx"
import React, { Children, ReactElement } from "react"
import NotificationItemLayoutDefault from "./Layout/Default"

export type NotificationItemProps = {
  layout?: "default" | "empty"
  type?: "info" | "error" | "warning" | "success" | "custom" | "none"
  CustomIcon?: React.ReactNode
  title?: string
  text?: string
  className?: string
  children?: ReactElement
  isClosable?: boolean
  placement?: "top" | "bottom"
  show?: boolean
  setShow?: (value: boolean) => void
  onClose?: () => void
} & React.HTMLAttributes<HTMLDivElement>

const Notification = ({
  className = "",
  placement = "bottom",
  show = true,
  layout = "default",
  setShow,
  onClose,
  children,
  ...rest
}: NotificationItemProps) => {
  const handleClose = () => {
    setShow?.(false)
    onClose?.()
  }

  return (
    <div
      className={clsx(
        "md:max-w-[320px] md:w-[320px] w-full bg-medusa-bg-base dark:bg-medusa-bg-base-dark rounded",
        "shadow-flyout dark:shadow-flyout-dark max-h-[calc(100vh-90px)]",
        "fixed md:right-1 left-0 z-[400] md:m-1",
        placement === "bottom" && "md:bottom-1 bottom-0",
        placement === "top" && "md:top-1 top-0",
        "opacity-100 transition-opacity duration-200 ease-ease",
        !show && "!opacity-0",
        className
      )}
    >
      {layout === "default" && (
        <NotificationItemLayoutDefault {...rest} handleClose={handleClose}>
          {children}
        </NotificationItemLayoutDefault>
      )}
      {layout === "empty" &&
        Children.map(children, (child) =>
          React.cloneElement(child, {
            onClose: handleClose,
          })
        )}
    </div>
  )
}

export default Notification
