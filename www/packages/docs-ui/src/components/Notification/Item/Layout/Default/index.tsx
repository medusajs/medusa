import React from "react"
import { NotificationItemProps } from "@/components/Notification/Item"
import clsx from "clsx"
import {
  CheckCircleSolid,
  ExclamationCircleSolid,
  InformationCircleSolid,
  XCircleSolid,
} from "@medusajs/icons"
import { Button } from "@/components/Button"

export type NotificationItemLayoutDefaultProps = NotificationItemProps & {
  handleClose: () => void
  closeButtonText?: string
}

export const NotificationItemLayoutDefault: React.FC<
  NotificationItemLayoutDefaultProps
> = ({
  type = "info",
  title = "",
  text = "",
  children,
  isClosable = true,
  handleClose,
  CustomIcon,
  closeButtonText = "Close",
}) => {
  return (
    <div
      className="bg-medusa-bg-base w-full h-full shadow-elevation-flyout dark:shadow-elevation-flyout-dark rounded-docs_DEFAULT"
      data-testid="default-layout"
    >
      <div className={clsx("flex gap-docs_1 p-docs_1")}>
        {type !== "none" && (
          <div
            className={clsx(
              type !== "custom" && "w-docs_2 flex justify-center items-center"
            )}
          >
            {type === "info" && (
              <InformationCircleSolid className="text-medusa-tag-blue-icon" />
            )}
            {type === "error" && (
              <XCircleSolid className="text-medusa-tag-red-icon" />
            )}
            {type === "warning" && (
              <ExclamationCircleSolid className="text-medusa-tag-orange-icon" />
            )}
            {type === "success" && (
              <CheckCircleSolid className="text-medusa-tag-green-icon" />
            )}
            {type === "custom" && CustomIcon}
          </div>
        )}
        <span
          className={clsx("text-compact-medium-plus", "text-medusa-fg-base")}
          data-testid="layout-title"
        >
          {title}
        </span>
      </div>
      {(text || children) && (
        <div
          className={clsx(
            "flex pt-0 pr-docs_1 pb-docs_1.5 pl-docs_1 gap-docs_1",
            "border-0 border-b border-solid border-medusa-border-base"
          )}
          data-testid="layout-content"
        >
          <div className="w-docs_2 flex-none"></div>
          <div className={clsx("flex flex-col", children && "gap-docs_1")}>
            {text && (
              <span className={clsx("text-medium text-medusa-fg-subtle")}>
                {text}
              </span>
            )}
            {children}
          </div>
        </div>
      )}
      {isClosable && (
        <div className={clsx("p-docs_1 flex justify-end items-center")}>
          <Button onClick={handleClose}>{closeButtonText}</Button>
        </div>
      )}
    </div>
  )
}
