import React from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import { Badge } from "docs-ui"
import BorderedIcon from "../BorderedIcon"
import { IconProps } from "@medusajs/icons/dist/types"

type LargeCardProps = {
  Icon: React.FC<IconProps>
  image: {
    light: string
    dark?: string
  }
  title: string
  action?: {
    href?: string
  }
  isSoon?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const LargeCard: React.FC<LargeCardProps> = ({
  Icon,
  image,
  title,
  action: { href } = {
    href: "",
  },
  isSoon = false,
  className = "",
  children,
}) => {
  return (
    <article
      className={clsx(
        "group bg-docs-bg-surface",
        "rounded",
        "p-1 !pb-1.5 shadow-card-rest dark:shadow-card-rest-dark",
        "flex flex-col justify-between relative",
        "[&:nth-child(3n+1):before]:bg-[2%_52%] [&:nth-child(3n+2):before]:bg-[19%_16%] [&:nth-child(3n+3):before]:bg-[17%_50%]",
        !isSoon && [
          "hover:bg-medusa-bg-subtle-hover dark:hover:bg-medusa-bg-base-hover hover:shadow-card-hover dark:hover:shadow-card-hover-dark",
          "group-hover:bg-medusa-bg-subtle-hover dark:group-hover:bg-medusa-bg-base-hover group-hover:shadow-card-hover dark:group-hover:shadow-card-hover-dark",
        ],
        "transition-all duration-200 ease-ease",
        "large-card",
        className
      )}
    >
      <div className={clsx("z-[3]")}>
        {isSoon && (
          <Badge variant={"purple"} className="absolute top-1 right-1">
            Guide coming soon
          </Badge>
        )}
        {(Icon || image) && (
          <BorderedIcon
            IconComponent={Icon}
            icon={image}
            iconClassName="w-[20px] h-[20px]"
            wrapperClassName="mb-1"
            iconWrapperClassName="p-[6px]"
          />
        )}
        <div className="mb-0.25">
          <span
            className={clsx(
              isSoon && "group-hover:text-medusa-fg-disabled",
              "text-medusa-fg-base text-compact-medium-plus",
              "transition-all duration-200 ease-ease"
            )}
          >
            {title}
          </span>
        </div>
        <div
          className={clsx(
            isSoon && "group-hover:text-medusa-fg-disabled",
            "transition-all duration-200 ease-ease text-medium"
          )}
        >
          {children}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className={clsx(
            "absolute top-0 left-0 w-full h-full z-[4] rounded",
            isSoon && "group-hover:pointer-events-none"
          )}
        ></Link>
      )}
    </article>
  )
}

export default LargeCard
