import React from "react"
import clsx from "clsx"

export type ButtonProps = {
  variant?: "secondary" | "primary" | "clear"
  btnTypeClassName?: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
} & React.HTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  variant,
  className = "",
  btnTypeClassName,
  onClick,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        !variant && "btn-secondary",
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "clear" && "btn-clear",
        btnTypeClassName,
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
