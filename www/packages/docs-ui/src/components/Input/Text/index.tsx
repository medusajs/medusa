import React from "react"
import clsx from "clsx"

export type InputTextProps = {
  className?: string
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const InputText = (props: InputTextProps) => {
  return (
    <input
      {...props}
      className={clsx(
        "bg-medusa-bg-field dark:bg-medusa-bg-field-dark shadow-button-secondary dark:shadow-button-secondary-dark",
        "border-medusa-border-base dark:border-medusa-border-base-dark rounded-docs_sm border border-solid",
        "px-docs_0.75 py-[9px]",
        "hover:bg-medusa-bg-field-hover dark:hover:bg-medusa-bg-field-hover-dark",
        "focus:border-medusa-border-interactive dark:focus:border-medusa-border-interactive-dark",
        "active:border-medusa-border-interactive dark:active:border-medusa-border-interactive-dark",
        "disabled:bg-medusa-bg-disabled dark:disabled:bg-medusa-bg-disabled-dark",
        "disabled:border-medusa-border-base dark:disabled:border-medusa-border-base-dark",
        "placeholder:text-medusa-fg-muted dark:placeholder:text-medusa-fg-muted-dark",
        "disabled:placeholder:text-medusa-fg-disabled dark:disabled:placeholder:text-medusa-fg-disabled-dark",
        "text-compact-medium font-base",
        props.className
      )}
    />
  )
}
