import React from "react"
import clsx from "clsx"
import { IconProps } from "@/icons"
import { Spinner } from "@medusajs/icons"

type SpinnerLoadingProps = {
  iconProps?: IconProps
}

const SpinnerLoading = ({ iconProps }: SpinnerLoadingProps) => {
  return (
    <span role="status">
      <Spinner
        {...iconProps}
        className={clsx("animate-spin", iconProps?.className)}
      />
    </span>
  )
}

export default SpinnerLoading
