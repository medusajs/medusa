import clsx from "clsx"
import React from "react"
import { GroupBase, PlaceholderProps } from "react-select"

const Placeholder = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  children,
  className,
  cx,
}: PlaceholderProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          placeholder: true,
        },
        clsx(
          "absolute top-1/2 -translate-y-1/2 select-none inter-base-regular text-grey-50",
          className
        )
      )}
    >
      {children}
    </div>
  )
}

export default Placeholder
