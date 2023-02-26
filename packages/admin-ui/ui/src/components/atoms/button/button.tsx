import clsx from "clsx"
import * as React from "react"
import { Spinner } from "../spinner"

export type ButtonProps = {
  variant: "primary" | "secondary" | "ghost" | "danger" | "nuclear"
  size?: "small" | "medium" | "large"
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "large",
      loading = false,
      className,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const variantClassname = clsx({
      ["btn-primary"]: variant === "primary",
      ["btn-secondary"]: variant === "secondary",
      ["btn-ghost"]: variant === "ghost",
      ["btn-danger"]: variant === "danger",
      ["btn-nuclear"]: variant === "nuclear",
    })

    const sizeClassname = clsx({
      ["btn-large"]: size === "large",
      ["btn-medium"]: size === "medium",
      ["btn-small"]: size === "small",
    })

    const joinedClassnames = clsx(variantClassname, sizeClassname, className)

    return (
      <button
        ref={ref}
        className={joinedClassnames}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <Spinner size={size} variant={"secondary"} />
        ) : (
          React.Children.map(children, (child, i) => {
            return (
              <span key={i} className="mr-xsmall last:mr-0">
                {child}
              </span>
            )
          })
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
