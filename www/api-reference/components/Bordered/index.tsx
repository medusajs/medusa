import React from "react"
import clsx from "clsx"

type BorderedProps = {
  wrapperClassName?: string
} & React.HTMLAttributes<HTMLSpanElement>

const Bordered: React.FC<BorderedProps> = ({ wrapperClassName, children }) => {
  return (
    <span
      className={clsx(
        "border-medusa-border-strong dark:border-medusa-border-strong-dark bg-docs-bg",
        "dark:bg-docs-bg-dark mr-1 inline-flex w-fit items-center justify-center rounded border border-solid p-[3px]",
        "no-zoom-img",
        wrapperClassName
      )}
    >
      {children}
    </span>
  )
}

export default Bordered
