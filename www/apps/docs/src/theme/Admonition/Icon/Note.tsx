import React from "react"
import { InformationCircleSolid } from "@medusajs/icons"
import type { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"

export default function AdmonitionIconNote({
  className,
  ...props
}: IconProps): JSX.Element {
  return (
    <InformationCircleSolid
      {...props}
      className={clsx(
        "inline-block mr-0.125 text-medusa-tag-neutral-icon",
        className
      )}
    />
  )
}
