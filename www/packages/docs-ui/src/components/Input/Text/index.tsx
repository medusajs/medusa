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
        "bg-medusa-bg-field-component shadow-border-base dark:shadow-border-base-dark",
        "rounded-docs_sm px-docs_0.5",
        "hover:bg-medusa-bg-field-component-hover",
        addGroupStyling && "group-hover:bg-medusa-bg-field-component-hover",
        "focus:border-medusa-border-interactive",
        "active:border-medusa-border-interactive",
        "disabled:bg-medusa-bg-disabled",
        "disabled:border-medusa-border-base",
        "placeholder:text-medusa-fg-muted",
        "disabled:placeholder:text-medusa-fg-disabled",
        "text-compact-small font-base",
        className
      )}
      ref={passedRef}
    />
  )
}
