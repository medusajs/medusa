import clsx from "clsx"
import React from "react"

export type DotsLoadingProps = {
  className?: string
}

export const DotsLoading = ({ className }: DotsLoadingProps) => {
  return (
    <span className={clsx("text-medium text-medusa-fg-subtle", className)}>
      <span className="animate-pulsingDots">.</span>
      <span className="animate-pulsingDots animation-delay-[500ms]">.</span>
      <span className="animate-pulsingDots animation-delay-[1000ms]">.</span>
    </span>
  )
}
