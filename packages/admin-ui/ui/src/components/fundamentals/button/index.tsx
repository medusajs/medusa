import React, { Children } from "react"
import clsx from "clsx"
import Spinner from "../../atoms/spinner"

export type ButtonProps = {
  variant: "primary" | "secondary" | "ghost" | "danger" | "nuclear"
  size?: "xsmall" | "small" | "medium" | "large"
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "large",
      loading = false,
      children,
      ...attributes
    },
    ref
  ) => {
    const handleClick = (e) => {
      if (!loading && attributes.onClick) {
        attributes.onClick(e)
      }
    }

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
      ["btn-xsmall"]: size === "xsmall",
    })

    return (
      <button
        {...attributes}
        className={clsx(
          "btn inline-flex flex-wrap gap-2 items-center",
          variantClassname,
          sizeClassname,
          attributes.className
        )}
        disabled={attributes.disabled || loading}
        ref={ref}
        onClick={handleClick}
      >
        {loading ? (
          <Spinner size={size} variant={"secondary"} />
        ) : (
          Children.map(children, (child, i) => <span key={i}>{child}</span>)
        )}
      </button>
    )
  }
)

export default Button
