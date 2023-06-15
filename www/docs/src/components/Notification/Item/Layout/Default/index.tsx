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
      <div className={clsx("tw-flex tw-gap-1 tw-p-1")}>
        {type !== "none" && (
          <div
            className={clsx(
              type !== "custom" &&
                "tw-w-2 tw-flex tw-justify-center tw-items-center"
            )}
          >
            {type === "info" && (
              <IconInformationCircleSolid iconColorClassName="tw-fill-medusa-support-info dark:tw-fill-medusa-support-info-dark" />
            )}
            {type === "error" && (
              <IconXCircleSolid iconColorClassName="tw-fill-medusa-tag-red-icon dark:tw-fill-medusa-tag-red-icon-dark" />
            )}
            {type === "warning" && (
              <IconExclamationCircleSolid iconColorClassName="tw-fill-medusa-tag-orange-icon dark:tw-fill-medusa-tag-orange-icon-dark" />
            )}
            {type === "success" && (
              <IconCheckCircleSolid iconColorClassName="tw-fill-medusa-tag-green-icon dark:tw-fill-medusa-tag-green-icon-dark" />
            )}
            {type === "custom" && CustomIcon}
          </div>
        )}
        <span
          className={clsx(
            "tw-text-label-regular-plus",
            "tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark"
          )}
        >
          {title}
        </span>
      </div>
      {(text || children) && (
        <div
          className={clsx(
            "tw-flex tw-pt-0 tw-pr-1 tw-pb-1.5 tw-pl-1 tw-gap-1",
            "tw-border-0 tw-border-b tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark"
          )}
        >
          <div className="tw-w-2 tw-flex-none"></div>
          <div className={clsx("tw-flex tw-flex-col", children && "tw-gap-1")}>
            {text && (
              <span
                className={clsx(
                  "tw-text-body-regular tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark"
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
        <div className={clsx("tw-p-1 tw-flex tw-justify-end tw-items-center")}>
          <Button onClick={handleClose}>Close</Button>
        </div>
      )}
    </>
  )
}

export default NotificationItemLayoutDefault
