import clsx from "clsx"
import React, { Children, ReactElement, useEffect, useRef } from "react"
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
        "md:tw-max-w-[320px] md:tw-w-[320px] tw-w-full tw-bg-medusa-bg-base dark:tw-bg-medusa-bg-base-dark tw-rounded",
        "tw-shadow-flyout dark:tw-shadow-flyout-dark",
        "tw-fixed md:tw-right-1 tw-left-0 tw-block tw-z-[400]",
        placement === "bottom" && "md:tw-bottom-1 tw-bottom-0",
        placement === "top" && "md:tw-top-1 tw-top-0",
        "tw-opacity-100 tw-transition-opacity tw-duration-200 tw-ease-ease",
        !show && "!tw-opacity-0",
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
