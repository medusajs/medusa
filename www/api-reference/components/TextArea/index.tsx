import React from "react"
import clsx from "clsx"

type TextAreaProps = {
  className?: string
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

const TextArea = (props: TextAreaProps) => {
  return (
    <textarea
      {...props}
      className={clsx(
        "bg-medusa-bg-field dark:bg-medusa-bg-field-dark shadow-button-secondary dark:shadow-button-secondary-dark",
        "border-medusa-border-loud-muted dark:border-medusa-border-loud-muted-dark rounded-sm border border-solid",
        "pt-0.4 px-0.75 text-medium font-base pb-[9px]",
        "hover:bg-medusa-bg-field-hover dark:hover:bg-medusa-bg-field-hover-dark",
        "focus:border-medusa-border-interactive dark:focus:border-medusa-border-interactive-dark",
        "active:border-medusa-border-interactive dark:active:border-medusa-border-interactive-dark",
        "disabled:bg-medusa-bg-disabled dark:disabled:bg-medusa-bg-disabled-dark",
        "disabled:border-medusa-border-base dark:disabled:border-medusa-border-base-dark",
        "placeholder:text-medusa-fg-muted dark:placeholder:text-medusa-fg-muted-dark",
        "disabled:placeholder:text-medusa-fg-disabled dark:disabled:placeholder:text-medusa-fg-disabled-dark",
        props.className
      )}
    />
  )
}

export default TextArea
