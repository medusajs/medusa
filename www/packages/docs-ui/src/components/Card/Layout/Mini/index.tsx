"use client"

import React from "react"
import clsx from "clsx"
import { CardProps } from "../.."
import { BorderedIcon, useIsExternalLink } from "../../../.."
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRightOnBox, TriangleRightMini } from "@medusajs/icons"

export const CardLayoutMini = ({
  icon,
  image,
  title,
  text,
  href,
}: CardProps) => {
  const isExternal = useIsExternalLink({ href })

  return (
    <div
      className={clsx(
        "relative rounded-docs_DEFAULT border-ui-fg-on-color border",
        "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
        "hover:shadow-elevation-card-hover dark:hover:shadow-elevation-card-hover-dark",
        "bg-medusa-tag-neutral-bg hover:bg-medusa-tag-neutral-bg-hover",
        "w-fit transition-all"
      )}
    >
      <div
        className={clsx(
          "rounded-docs_DEFAULT flex gap-docs_0.75 py-docs_0.25",
          "pl-docs_0.25 pr-docs_0.75 items-center"
        )}
      >
        {icon && (
          <BorderedIcon
            wrapperClassName={clsx("p-[4.5px] bg-medusa-bg-component-hover")}
            IconComponent={icon}
          />
        )}
        {image && (
          <Image
            src={image}
            className="shadow-elevation-card-rest rounded-docs_xs"
            width={45}
            height={36}
            alt={title || text || ""}
          />
        )}
        <div className="flex flex-col">
          {title && (
            <span className="text-x-small-plus text-medusa-fg-base">
              {title}
            </span>
          )}
          {text && (
            <span className="text-x-small-plus text-medusa-fg-subtle">
              {text}
            </span>
          )}
        </div>
        <span className="text-medusa-fg-subtle">
          {isExternal ? <ArrowUpRightOnBox /> : <TriangleRightMini />}
        </span>
        {href && (
          <Link href={href} className="absolute left-0 top-0 w-full h-full" />
        )}
      </div>
    </div>
  )
}
