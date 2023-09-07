import React from "react"
import clsx from "clsx"

type TextAreaProps = {
  className?: string
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <textarea
      {...props}
      className={clsx(
        "bg-medusa-bg-field dark:bg-medusa-bg-field-dark shadow-button-secondary dark:shadow-button-secondary-dark",
        "rounded border-medusa-border-base dark:border-medusa-border-base-dark border border-solid",
        "px-0.75 pt-0.4 pb-[9px]",
        "hover:bg-medusa-bg-field-hover dark:hover:bg-medusa-bg-field-hover-dark",
        "focus:border-medusa-border-interactive dark:focus:border-medusa-border-interactive-dark",
        "active:border-medusa-border-interactive dark:active:border-medusa-border-interactive-dark",
        "disabled:bg-medusa-bg-disabled dark:disabled:bg-medusa-bg-disabled-dark",
        "disabled:border-medusa-border-base dark:disabled:border-medusa-border-base-dark",
        "placeholder:text-medusa-fg-muted dark:placeholder:text-medusa-fg-muted-dark",
        "disabled:placeholder:text-medusa-fg-disabled dark:disabled:placeholder:text-medusa-fg-disabled-dark",
        "text-medium font-base",
        props.className
      )}
    />
  )
}

export default TextArea
