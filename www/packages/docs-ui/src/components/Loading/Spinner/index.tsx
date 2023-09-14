import React from "react"
import clsx from "clsx"
import { IconProps } from "@/icons"
import { Spinner } from "@medusajs/icons"

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
