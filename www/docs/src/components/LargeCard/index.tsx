import React from "react"
import BorderedIcon from "../BorderedIcon"
import clsx from "clsx"
import Badge from "../Badge"
import { IconProps } from "@site/src/theme/Icon/index"

type LargeCardProps = {
  Icon: React.FC<IconProps>
  image: {
    light: string
    dark?: string
  }
  title: string
  action: {
    href: string
  }
  isSoon?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const LargeCard: React.FC<LargeCardProps> = ({
  Icon,
  image,
  title,
  action: { href },
  isSoon = false,
  className = "",
  children,
}) => {
  return (
    <article
      className={clsx(
        "tw-group tw-bg-docs-bg-surface dark:tw-bg-docs-bg-surface-dark",
        "tw-rounded",
        "tw-p-1 !tw-pb-1.5 tw-shadow-card-rest dark:tw-shadow-card-rest-dark",
        "tw-flex tw-flex-col tw-justify-between tw-relative",
        "[&:nth-child(3n+1):before]:tw-bg-[2%_52%] [&:nth-child(3n+2):before]:tw-bg-[19%_16%] [&:nth-child(3n+3):before]:tw-bg-[17%_50%]",
        !isSoon &&
          "hover:tw-bg-medusa-bg-subtle-hover dark:hover:tw-bg-medusa-bg-base-hover-dark hover:tw-shadow-card-hover dark:hover:tw-shadow-card-hover-dark",
        "large-card",
        className
      )}
    >
      <div className={clsx("tw-z-[3]")}>
        {isSoon && (
          <Badge variant={"purple"} className="tw-absolute tw-top-1 tw-right-1">
            Guide coming soon
          </Badge>
        )}
        {(Icon || image) && (
          <BorderedIcon
            IconComponent={Icon}
            icon={image}
            iconClassName="tw-w-[20px] tw-h-[20px]"
            wrapperClassName="tw-mb-1"
            iconWrapperClassName="tw-p-[6px]"
          />
        )}
        <div className="tw-mb-[4px]">
          <span
            className={clsx(
              isSoon &&
                "group-hover:tw-text-medusa-text-disabled dark:group-hover:tw-text-medusa-text-disabled-dark",
              "tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark tw-text-label-regular-plus",
              "tw-transition-all tw-duration-200 tw-ease-ease"
            )}
          >
            {title}
          </span>
        </div>
        <div
          className={clsx(
            isSoon &&
              "group-hover:tw-text-medusa-text-disabled dark:group-hover:tw-text-medusa-text-disabled-dark",
            "tw-transition-all tw-duration-200 tw-ease-ease tw-text-body-regular"
          )}
        >
          {children}
        </div>
      </div>
      <a
        href={href}
        className={clsx(
          "tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-[4] tw-rounded",
          isSoon && "group-hover:tw-pointer-events-none"
        )}
      ></a>
    </article>
  )
}

export default LargeCard
