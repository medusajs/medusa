import React from "react"
import clsx from "clsx"

export type LoadingProps = {
  className?: string
  barClassName?: string
  count?: number
}

export const Loading = ({
  className,
  count = 6,
  barClassName,
}: LoadingProps) => {
  const getLoadingBars = () => {
    const bars = []
    for (let i = 0; i < count; i++) {
      bars.push(
        <span
          className={clsx(
            "bg-medusa-bg-subtle-pressed h-docs_1 w-full rounded-full",
            barClassName
          )}
          key={i}
        ></span>
      )
    }

    return bars
  }
  return (
    <span
      role="status"
      className={clsx(
        "my-docs_1 flex w-full animate-pulse flex-col gap-docs_1",
        className
      )}
    >
      {getLoadingBars()}
      <span className="sr-only">Loading...</span>
    </span>
  )
}
