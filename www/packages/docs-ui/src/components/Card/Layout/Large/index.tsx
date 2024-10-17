import React from "react"
import { CardProps } from "../.."
import { useIsExternalLink } from "../../../.."
import clsx from "clsx"
import { ArrowUpRightOnBox, TriangleRightMini } from "@medusajs/icons"
import Link from "next/link"

export const CardLargeLayout = ({
  title,
  text,
  image,
  icon,
  href,
  className,
}: CardProps) => {
  const isExternal = useIsExternalLink({ href })
  const IconComponent = icon

  return (
    <div
      className={clsx(
        "relative flex flex-col gap-docs_0.75",
        "justify-start group",
        className
      )}
    >
      <div
        className={clsx(
          "rounded-docs_DEFAULT bg-medusa-bg-component w-[290px] h-[144px]",
          "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
          href &&
            "group-hover:shadow-elevation-card-hover group-hover:dark:shadow-elevation-card-hover-dark",
          "px-docs_0.75 py-docs_0.5 flex justify-center items-center w-full"
        )}
      >
        {IconComponent && (
          <IconComponent
            className="text-medusa-fg-subtle"
            width={32}
            height={32}
            viewBox="0 0 32 32"
          />
        )}
        {image && (
          <img src={image} alt={title || text || ""} className="w-[144px]" />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex gap-docs_0.25 items-center text-medusa-fg-base">
          {title && <span className="text-compact-small-plus">{title}</span>}
          {href && isExternal && <ArrowUpRightOnBox />}
          {href && !isExternal && (
            <TriangleRightMini className="group-hover:translate-x-docs_0.125 transition-transform" />
          )}
        </div>
        {text && (
          <span className="text-small-plus text-medusa-fg-subtle">{text}</span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="absolute left-0 top-0 h-full w-full rounded"
        />
      )}
    </div>
  )
}
