import React from "react"
import clsx from "clsx"
import { Badge, BorderedIcon, Link } from "@/components"
import { ArrowUpRightOnBox, TriangleRightMini } from "@medusajs/icons"
import { CardProps } from "../../.."
import { useIsExternalLink } from "../../../.."

export const CardDefaultLayout = ({
  icon,
  image,
  title,
  text,
  href,
  className,
  contentClassName,
  iconClassName,
  children,
  badge,
}: CardProps) => {
  const isExternal = useIsExternalLink({ href })

  return (
    <div
      className={clsx(
        "bg-medusa-bg-component w-full rounded-docs_DEFAULT",
        "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
        "py-docs_0.5 px-docs_0.75 relative",
        "flex justify-start items-center gap-docs_0.75 transition-shadow",
        href &&
          "hover:shadow-elevation-card-hover dark:hover:shadow-elevation-card-hover-dark",
        className
      )}
    >
      {icon && (
        <BorderedIcon
          wrapperClassName={clsx(
            "p-[4.5px] bg-medusa-bg-component-hover",
            iconClassName
          )}
          IconComponent={icon}
        />
      )}
      {image && (
        <BorderedIcon
          wrapperClassName={clsx("bg-medusa-bg-base", iconClassName)}
          icon={image}
        />
      )}
      <div
        className={clsx("flex flex-col flex-1 overflow-auto", contentClassName)}
      >
        {title && (
          <div className="text-small-plus text-medusa-fg-base truncate">
            {title}
          </div>
        )}
        {text && (
          <span className="text-small-plus text-medusa-fg-subtle">{text}</span>
        )}
        {children}
      </div>
      {badge && <Badge {...badge} />}
      <span className="text-medusa-fg-subtle">
        {isExternal ? <ArrowUpRightOnBox /> : <TriangleRightMini />}
      </span>

      {href && (
        <Link
          href={href}
          className="absolute left-0 top-0 h-full w-full rounded"
        />
      )}
    </div>
  )
}
