import clsx from "clsx"
import React from "react"

export type RadioItemProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  checked?: boolean
}

export const RadioItem = ({ className, checked, ...props }: RadioItemProps) => {
  return (
    <div className="p-[3px] flex justify-center items-center relative">
      <input
        type="radio"
        className={clsx(
          "appearance-none bg-medusa-bg-component shadow-borders-base dark:shadow-border-base-dark",
          "w-[14px] h-[14px] rounded-full",
          "focus:shadow-borders-interactive-with-focus disabled:opacity-50",
          "checked:!bg-medusa-bg-interactive checked:!shadow-borders-interactive-with-shadow",
          !checked && "hover:bg-medusa-bg-component-hover",
          className
        )}
        checked={checked}
        {...props}
      />
      {checked && (
        <span
          className={clsx(
            "w-[6px] h-[6px] bg-medusa-bg-base dark:bg-medusa-fg-on-color absolute top-1/2 left-1/2 rounded-full",
            "-translate-x-1/2 -translate-y-1/2 shadow-details-contrast-on-bg-interactive"
          )}
          data-testid="radio-item-checked-indicator"
        />
      )}
    </div>
  )
}
