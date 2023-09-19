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
      "inline-flex flex-row justify-center items-center",
      "py-[5px] px-docs_0.75 rounded-docs_sm cursor-pointer",
      "bg-button-inverted bg-medusa-button-inverted dark:bg-button-inverted-dark dark:bg-medusa-button-inverted-dark",
      "hover:bg-medusa-button-inverted-hover hover:bg-no-image dark:hover:bg-medusa-button-inverted-hover-dark hover:no-underline",
      "active:bg-medusa-button-inverted-pressed active:bg-no-image dark:active:bg-medusa-button-inverted-pressed-dark",
      "focus:bg-medusa-button-inverted-pressed focus:bg-no-image dark:focus:bg-medusa-button-inverted-pressed-dark",
      "shadow-button-colored active:shadow-button-colored-focused focus:shadow-button-colored-focused transition-shadow",
      "dark:shadow-button-colored-dark dark:active:shadow-button-colored-focused-dark dark:focus:shadow-button-colored-focused-dark",
      "disabled:!bg-no-image disabled:bg-medusa-bg-disabled dark:disabled:bg-medusa-bg-disabled-dark",
      "disabled:cursor-not-allowed disabled:border-medusa-border-base dark:disabled:border-medusa-border-base-dark",
      "text-compact-small-plus text-medusa-fg-on-inverted dark:text-medusa-fg-on-inverted-dark",
      "[&_a]:text-medusa-fg-on-inverted dark:[&_a]:text-medusa-fg-on-inverted-dark",
      "disabled:text-medusa-fg-disabled dark:disabled:text-medusa-fg-disabled-dark",
      "[&_a]:disabled:text-medusa-fg-disabled dark:[&_a]:disabled:text-medusa-fg-disabled-dark",
      "border border-medusa-border-loud dark:border-medusa-border-loud-dark",
      "select-none",
    ],
    secondary: [
      "inline-flex flex-row justify-center items-center",
      "py-[5px] px-docs_0.75 rounded-docs_sm cursor-pointer",
      "bg-button-neutral bg-medusa-button-neutral dark:bg-button-neutral-dark dark:bg-medusa-button-neutral-dark",
      "hover:bg-medusa-button-neutral-hover hover:bg-no-image dark:hover:bg-medusa-button-neutral-hover-dark hover:no-underline",
      "active:bg-medusa-button-neutral-pressed active:bg-no-image dark:active:bg-medusa-button-neutral-pressed-dark",
      "focus:bg-medusa-button-neutral-pressed focus:bg-no-image dark:focus:bg-medusa-button-neutral-pressed-dark",
      "disabled:!bg-no-image disabled:bg-medusa-bg-disabled dark:disabled:bg-medusa-bg-disabled-dark",
      "disabled:cursor-not-allowed",
      "border border-solid border-medusa-border-base dark:border-medusa-border-base-dark",
      "text-compact-small-plus text-medusa-fg-base dark:text-medusa-fg-base-dark",
      "[&_a]:text-medusa-fg-base dark:[&_a]:text-medusa-fg-base-dark",
      "shadow-button-neutral focus:shadow-button-neutral-focused active:shadow-button-neutral-focused transition-shadow",
      "dark:shadow-button-neutral dark:focus:shadow-button-neutral-focused dark:active:shadow-button-neutral-focused",
      "select-none",
    ],
    clear: ["bg-transparent shadow-none border-0 outline-none cursor-pointer"],
  }

  return (
    <button
      className={clsx(
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
