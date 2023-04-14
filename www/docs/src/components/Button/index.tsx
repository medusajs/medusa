import React from "react"
import clsx from "clsx"

type ButtonProps = {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
} & React.HTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  className = "",
  onClick,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "tw-flex tw-flex-row tw-justify-center tw-items-center tw-py-[6px] tw-px-[12px] tw-rounded tw-cursor-pointer",
        "tw-bg-medusa-button-secondary dark:tw-bg-medusa-button-secondary-dark",
        "tw-border tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark",
        "tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark",
        "tw-text-label-small-plus tw-font-base",
        "hover:tw-bg-medusa-button-secondary-hover dark:hover:tw-bg-medusa-button-secondary-hover-dark",
        "focus:tw-shadow-button-focused dark:focus:tw-shadow-button-focused-dark",
        "tw-mr-0.5 last:tw-mr-0",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
