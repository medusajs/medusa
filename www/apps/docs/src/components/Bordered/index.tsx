import React from "react"
import clsx from "clsx"

type BorderedProps = {
  wrapperClassName?: string
} & React.HTMLAttributes<HTMLSpanElement>

const Bordered: React.FC<BorderedProps> = ({ wrapperClassName, children }) => {
  return (
    <span
      className={clsx(
        "inline-flex justify-center items-center rounded p-[3px] border border-solid border-medusa-border-strong dark:border-medusa-border-strong-dark mr-1 w-fit bg-docs-bg dark:bg-docs-bg-dark",
        "no-zoom-img",
        wrapperClassName
      )}
    >
      {children}
    </span>
  )
}

export default Bordered
