import React from "react"
import clsx from "clsx"

export type InputTextProps = {
  className?: string
  addGroupStyling?: boolean
  passedRef?: React.Ref<HTMLInputElement>
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const InputText = ({
  addGroupStyling = false,
  className,
  passedRef,
  ...props
}: InputTextProps) => {
  return (
    <input
      {...props}
      className={clsx(
        "bg-medusa-bg-field shadow-border-base dark:shadow-border-base-dark",
        "border-medusa-border-base rounded-docs_sm border border-solid",
        "px-docs_0.75 py-[9px]",
        "hover:bg-medusa-bg-field-hover",
        addGroupStyling && "group-hover:bg-medusa-bg-field-hover",
        "focus:border-medusa-border-interactive",
        "active:border-medusa-border-interactive",
        "disabled:bg-medusa-bg-disabled",
        "disabled:border-medusa-border-base",
        "placeholder:text-medusa-fg-muted",
        "disabled:placeholder:text-medusa-fg-disabled",
        "text-compact-medium font-base",
        className
      )}
      ref={passedRef}
    />
  )
}
