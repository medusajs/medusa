import { LightBulbSolid } from "@medusajs/icons"
import type { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"
import React from "react"

export default function AdmonitionIconTip({
  className,
  ...props
}: IconProps): JSX.Element {
  return (
    <LightBulbSolid
      {...props}
      className={clsx(
        "inline-block mr-0.125 text-medusa-tag-orange-icon",
        className
      )}
    />
  )
}
