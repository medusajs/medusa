import clsx from "clsx"
import React from "react"

type HomepageHorizontalDottedSeparatorProps = {
  className?: string
}

export const HomepageHorizontalDottedSeparator = ({
  className,
}: HomepageHorizontalDottedSeparatorProps) => {
  return (
    <span
      className={clsx(
        "block w-full h-px relative bg-border-dotted-disabled",
        "bg-[length:3px_1px] bg-repeat-x bg-bottom",
        className
      )}
    ></span>
  )
}
