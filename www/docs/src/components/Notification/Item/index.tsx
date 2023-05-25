import IconCheckCircleSolid from "@site/src/theme/Icon/CheckCircleSolid"
import IconClose from "@site/src/theme/Icon/Close"
import IconExclamationCircleSolid from "@site/src/theme/Icon/ExclamationCircleSolid"
import IconInformationCircleSolid from "@site/src/theme/Icon/InformationCircleSolid"
import IconXCircleSolid from "@site/src/theme/Icon/XCircleSolid"
import clsx from "clsx"
import React from "react"

export type NotificationItemProps = {
  type?: "info" | "error" | "warning" | "success" | "numbered"
  title: string
  text?: string
  className?: string
  children?: React.ReactNode
  isClosable?: boolean
  placement?: "top" | "bottom"
  show?: boolean
  setShow?: (value: boolean) => void
  onClose?: () => void
  stepNumber?: number
} & React.HTMLAttributes<HTMLDivElement>

const Notification = ({
  type = "info",
  title,
  text = "",
  className = "",
  children,
  isClosable = true,
  placement = "bottom",
  show = true,
  setShow,
  onClose,
  stepNumber = 1,
}: NotificationItemProps) => {
  const handleClose = () => {
    setShow?.(false)
    onClose?.()
  }

  return (
    <div
      className={clsx(
        "tw-max-w-[320px] tw-w-[320px] tw-bg-medusa-bg-base dark:tw-bg-medusa-bg-base-dark tw-rounded",
        "tw-shadow-flyout dark:tw-shadow-flyout-dark",
        "tw-fixed tw-right-1 md:tw-flex tw-gap-0.5 tw-hidden tw-z-[400]",
        placement === "bottom" && "tw-bottom-1",
        placement === "top" && "tw-top-1",
        "tw-px-[10px] tw-pt-[10px] tw-pb-1",
        "tw-opacity-100 tw-transition-opacity tw-duration-200 tw-ease-ease",
        !show && "!tw-opacity-0",
        className
      )}
    >
      <div className={clsx("tw-flex tw-gap-1 tw-w-[260px]")}>
        <div>
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
          {type === "numbered" && (
            <span
              className={clsx(
                "tw-bg-medusa-support-info dark:tw-bg-medusa-support-info-dark tw-text-label-x-small-plus tw-text-medusa-text-on-color dark:tw-text-medusa-text-on-color-dark",
                "tw-inline-flex tw-w-[20px] tw-h-[20px] tw-justify-center tw-items-center tw-rounded-full"
              )}
            >
              {stepNumber}
            </span>
          )}
        </div>
        <div
          className={clsx(
            "tw-flex tw-flex-col tw-w-5/6",
            children && "tw-gap-1"
          )}
        >
          <div className={clsx("tw-flex tw-flex-col", text && "tw-gap-[4px]")}>
            <span
              className={clsx(
                "tw-text-label-small-plus",
                "tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark"
              )}
            >
              {title}
            </span>
            {text && (
              <span
                className={clsx(
                  "tw-text-label-small tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark"
                )}
              >
                {text}
              </span>
            )}
          </div>
          {children}
        </div>
      </div>
      {isClosable && (
        <div className="tw-w-[32px]">
          <button className="transparent-button" onClick={handleClose}>
            <IconClose iconColorClassName="tw-stroke-medusa-icon-muted dark:tw-stroke-medusa-icon-muted-dark" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Notification
