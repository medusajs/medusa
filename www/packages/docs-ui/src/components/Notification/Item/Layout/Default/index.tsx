import React from "react"
import { NotificationItemProps } from "../.."
import clsx from "clsx"
import {
  CheckCircleSolid,
  ExclamationCircleSolid,
  InformationCircleSolid,
  XCircleSolid,
} from "@medusajs/icons"
import { Button } from "@/components"

export type NotificationItemLayoutDefaultProps = NotificationItemProps & {
  handleClose: () => void
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
}) => {
  return (
    <>
      <div className={clsx("flex gap-docs_1 p-docs_1")}>
        {type !== "none" && (
          <div
            className={clsx(
              type !== "custom" && "w-docs_2 flex justify-center items-center"
            )}
          >
            {type === "info" && (
              <InformationCircleSolid className="text-medusa-fg-interactive-dark" />
            )}
            {type === "error" && (
              <XCircleSolid className="text-medusa-tag-red-icon dark:text-medusa-tag-red-icon-dark" />
            )}
            {type === "warning" && (
              <ExclamationCircleSolid className="text-medusa-tag-orange-icon dark:text-medusa-tag-orange-icon-dark" />
            )}
            {type === "success" && (
              <CheckCircleSolid className="text-medusa-tag-green-icon dark:text-medusa-tag-green-icon-dark" />
            )}
            {type === "custom" && CustomIcon}
          </div>
        )}
        <span
          className={clsx(
            "text-compact-medium-plus",
            "text-medusa-fg-base dark:text-medusa-fg-base-dark"
          )}
        >
          {title}
        </span>
      </div>
      {(text || children) && (
        <div
          className={clsx(
            "flex pt-0 pr-docs_1 pb-docs_1.5 pl-docs_1 gap-docs_1",
            "border-0 border-b border-solid border-medusa-border-base dark:border-medusa-border-base-dark"
          )}
        >
          <div className="w-docs_2 flex-none"></div>
          <div className={clsx("flex flex-col", children && "gap-docs_1")}>
            {text && (
              <span
                className={clsx(
                  "text-medium text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark"
                )}
              >
                {text}
              </span>
            )}
            {children}
          </div>
        </div>
      )}
      {isClosable && (
        <div className={clsx("p-docs_1 flex justify-end items-center")}>
          <Button onClick={handleClose}>Close</Button>
        </div>
      )}
    </>
  )
}
