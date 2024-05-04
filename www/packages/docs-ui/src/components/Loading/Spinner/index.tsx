import React from "react"
import clsx from "clsx"
import { Spinner } from "@medusajs/icons"
import { IconProps } from "@medusajs/icons/dist/types"

export type SpinnerLoadingProps = {
  iconProps?: IconProps
}

export const SpinnerLoading = ({ iconProps }: SpinnerLoadingProps) => {
  return (
    <span role="status">
      <Spinner
        {...iconProps}
        className={clsx("animate-spin", iconProps?.className)}
      />
    </span>
  )
}
