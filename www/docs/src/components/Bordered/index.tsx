import React from "react"
import clsx from "clsx"

type BorderedProps = {
  wrapperClassName?: string
} & React.HTMLAttributes<HTMLSpanElement>

const Bordered: React.FC<BorderedProps> = ({ wrapperClassName, children }) => {
  return (
    <span
      className={clsx(
        "tw-inline-flex tw-justify-center tw-items-center tw-rounded tw-p-[3px] tw-border tw-border-solid tw-border-medusa-border-strong dark:tw-border-medusa-border-strong-dark tw-mr-1 tw-w-fit tw-bg-docs-bg dark:tw-bg-docs-bg-dark",
        "no-zoom-img",
        wrapperClassName
      )}
    >
      {children}
    </span>
  )
}

export default Bordered
