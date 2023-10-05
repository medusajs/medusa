import clsx from "clsx"
import React from "react"

export type ButtonVariants = "primary" | "secondary" | "clear"

export type ButtonType = "default" | "icon"

export type ButtonProps = {
  isSelected?: boolean
  disabled?: boolean
  variant?: ButtonVariants
  className?: string
  buttonType?: ButtonType
  buttonRef?: React.LegacyRef<HTMLButtonElement>
} & React.HTMLAttributes<HTMLButtonElement>

export const Button = ({
  className,
  children,
  variant = "primary",
  buttonType = "default",
  buttonRef,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: [
      "py-[5px] px-docs_0.75 rounded-docs_sm cursor-pointer",
      "bg-button-inverted bg-medusa-button-inverted dark:bg-button-inverted-dark",
      "hover:bg-medusa-button-inverted-hover hover:bg-no-image hover:no-underline",
      "active:bg-medusa-button-inverted-pressed active:bg-no-image",
      "focus:bg-medusa-button-inverted-pressed focus:bg-no-image",
      "shadow-button-colored active:shadow-button-colored-focused focus:shadow-button-colored-focused transition-shadow",
      "dark:shadow-button-colored-dark dark:active:shadow-button-colored-focused-dark dark:focus:shadow-button-colored-focused-dark",
      "disabled:!bg-no-image disabled:bg-medusa-bg-disabled",
      "disabled:cursor-not-allowed disabled:border-medusa-border-base",
      "text-compact-small-plus text-medusa-fg-on-inverted",
      "[&_a]:text-medusa-fg-on-inverted",
      "disabled:text-medusa-fg-disabled",
      "[&_a]:disabled:text-medusa-fg-disabled",
      "border border-medusa-border-loud",
      "select-none",
    ],
    secondary: [
      "py-[5px] px-docs_0.75 rounded-docs_sm cursor-pointer",
      "bg-button-neutral bg-medusa-button-neutral dark:bg-button-neutral-dark",
      "hover:bg-medusa-button-neutral-hover hover:bg-no-image hover:no-underline",
      "active:bg-medusa-button-neutral-pressed active:bg-no-image",
      "focus:bg-medusa-button-neutral-pressed focus:bg-no-image",
      "disabled:!bg-no-image disabled:bg-medusa-bg-disabled",
      "disabled:cursor-not-allowed",
      "border border-solid border-medusa-border-base",
      "text-compact-small-plus text-medusa-fg-base",
      "[&_a]:text-medusa-fg-base",
      "shadow-button-neutral focus:shadow-button-neutral-focused active:shadow-button-neutral-focused transition-shadow",
      "dark:shadow-button-neutral dark:focus:shadow-button-neutral-focused dark:active:shadow-button-neutral-focused",
      "select-none",
    ],
    clear: [
      "bg-transparent shadow-none border-0 outline-none cursor-pointer text-fg-medusa-subtle",
    ],
  }

  return (
    <button
      className={clsx(
        "inline-flex flex-row justify-center items-center gap-[6px]",
        variant === "primary" && variantClasses.primary,
        variant === "secondary" && variantClasses.secondary,
        variant === "clear" && variantClasses.clear,
        buttonType === "icon" && "!px-docs_0.25",
        className
      )}
      ref={buttonRef}
      {...props}
    >
      {children}
    </button>
  )
}
