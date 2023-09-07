import React from "react"
import { NotificationItemProps } from "../.."
import clsx from "clsx"
import IconInformationCircleSolid from "@site/src/theme/Icon/InformationCircleSolid"
import IconXCircleSolid from "@site/src/theme/Icon/XCircleSolid"
import IconExclamationCircleSolid from "@site/src/theme/Icon/ExclamationCircleSolid"
import IconCheckCircleSolid from "@site/src/theme/Icon/CheckCircleSolid"
import Button from "@site/src/components/Button"

type NotificationItemLayoutDefaultProps = NotificationItemProps & {
  handleClose: () => void
}

const NotificationItemLayoutDefault: React.FC<
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
      <div className={clsx("flex gap-1 p-1")}>
        {type !== "none" && (
          <div
            className={clsx(
              type !== "custom" && "w-2 flex justify-center items-center"
            )}
          >
            {type === "info" && (
              <IconInformationCircleSolid iconColorClassName="fill-medusa-fg-interactive-dark" />
            )}
            {type === "error" && (
              <IconXCircleSolid iconColorClassName="fill-medusa-tag-red-icon dark:fill-medusa-tag-red-icon-dark" />
            )}
            {type === "warning" && (
              <IconExclamationCircleSolid iconColorClassName="fill-medusa-tag-orange-icon dark:fill-medusa-tag-orange-icon-dark" />
            )}
            {type === "success" && (
              <IconCheckCircleSolid iconColorClassName="fill-medusa-tag-green-icon dark:fill-medusa-tag-green-icon-dark" />
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
            "flex pt-0 pr-1 pb-1.5 pl-1 gap-1",
            "border-0 border-b border-solid border-medusa-border-base dark:border-medusa-border-base-dark"
          )}
        >
          <div className="w-2 flex-none"></div>
          <div className={clsx("flex flex-col", children && "gap-1")}>
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
        <div className={clsx("p-1 flex justify-end items-center")}>
          <Button onClick={handleClose}>Close</Button>
        </div>
      )}
    </>
  )
}

export default NotificationItemLayoutDefault
