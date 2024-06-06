import clsx from "clsx"
import React from "react"

export type ButtonVariants =
  | "primary"
  | "secondary"
  | "transparent"
  | "transparent-clear"

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
      "px-[10px] py-[6px] rounded-docs_sm cursor-pointer",
      "bg-medusa-button-inverted",
      "hover:bg-medusa-button-inverted-hover hover:no-underline",
      "active:bg-medusa-button-inverted-pressed",
      "focus:bg-medusa-button-inverted",
      "shadow-button-inverted focus:shadow-button-inverted-focused transition-shadow",
      "dark:shadow-button-inverted-dark dark:focus:shadow-button-inverted-focused-dark",
      "disabled:bg-medusa-bg-disabled disabled:shadow-button-neutral dark:disabled:shadow-button-neutral-dark",
      "disabled:cursor-not-allowed",
      "text-compact-small-plus text-medusa-contrast-fg-primary",
      "[&_a]:text-medusa-contrast-fg-primary",
      "disabled:text-medusa-fg-disabled",
      "[&_a]:disabled:text-medusa-fg-disabled",
      "select-none",
    ],
    secondary: [
      "px-[10px] py-[6px] rounded-docs_sm cursor-pointer",
      "bg-medusa-button-neutral",
      "hover:bg-medusa-button-neutral-hover hover:no-underline",
      "active:bg-medusa-button-neutral-pressed",
      "focus:bg-medusa-button-neutral",
      "disabled:bg-medusa-bg-disabled disabled:shadow-button-neutral dark:disabled:shadow-button-neutral-dark",
      "disabled:cursor-not-allowed disabled:text-medusa-fg-disabled",
      "text-compact-small-plus text-medusa-fg-base",
      "[&_a]:text-medusa-fg-base",
      "shadow-button-neutral focus:shadow-button-neutral-focused active:shadow-button-neutral transition-shadow",
      "dark:shadow-button-neutral dark:focus:shadow-button-neutral-focused dark:active:shadow-button-neutral",
      "select-none",
    ],
    transparent: [
      "px-[10px] py-[6px] rounded-docs_sm cursor-pointer",
      "bg-transparent shadow-none border-0 outline-none",
      "text-compact-small-plus text-medusa-fg-base",
      "hover:bg-medusa-button-transparent-hover",
      "active:bg-medusa-button-transparent-pressed",
      "focus:bg-medusa-bg-base focus:shadow-button-neutral-focused dark:focus:shadow-button-neutral-focused-dark",
      "disabled:bg-transparent disabled:shadow-button-neutral dark:disabled:shadow-button-neutral-dark",
      "disabled:cursor-not-allowed disabled:text-medusa-fg-disabled",
    ],
    transparentClear: [
      "px-[10px] py-[6px] rounded-docs_sm cursor-pointer",
      "bg-transparent shadow-none border-0 outline-none",
      "text-compact-small-plus text-medusa-fg-muted",
      "hover:bg-medusa-button-transparent-hover",
      "active:bg-medusa-button-transparent-pressed",
      "focus:bg-medusa-bg-base focus:shadow-button-neutral-focused dark:focus:shadow-button-neutral-focused-dark",
      "disabled:bg-transparent disabled:shadow-button-neutral dark:disabled:shadow-button-neutral-dark",
      "disabled:cursor-not-allowed disabled:text-medusa-fg-disabled",
    ],
  }

  return (
    <button
      className={clsx(
        "inline-flex flex-row justify-center items-center gap-[6px]",
        variant === "primary" && variantClasses.primary,
        variant === "secondary" && variantClasses.secondary,
        variant === "transparent" && variantClasses.transparent,
        variant === "transparent-clear" && variantClasses.transparentClear,
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
