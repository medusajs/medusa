import clsx from "clsx"
import React from "react"

type HomepageVerticalDottedSeparatorProps = {
  className?: string
}

export const HomepageVerticalDottedSeparator = ({
  className,
}: HomepageVerticalDottedSeparatorProps) => {
  return (
    <span
      className={clsx(
        "block h-full w-px relative bg-border-dotted-disabled-vertical",
        "bg-[length:1px_3px] bg-repeat-y bg-right",
        className
      )}
    ></span>
  )
}
