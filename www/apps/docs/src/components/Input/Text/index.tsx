import clsx from "clsx"
import React from "react"
type InputTextProps = {
  className?: string
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const InputText: React.FC<InputTextProps> = (props) => {
  return (
    <input
      {...props}
      className={clsx(
        "bg-medusa-bg-field dark:bg-medusa-bg-field-dark shadow-button-secondary dark:shadow-button-secondary-dark",
        "rounded border-medusa-border-base dark:border-medusa-border-base-dark border border-solid",
        "px-0.75 py-[9px]",
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

export default InputText
