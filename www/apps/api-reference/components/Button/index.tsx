import clsx from "clsx"

export type ButtonProps = {
  isSelected?: boolean
  disabled?: boolean
  variant?: "primary" | "secondary" | "clear"
  darkVariant?: "primary" | "secondary" | "clear"
} & React.HTMLAttributes<HTMLButtonElement>

const Button = ({
  className,
  children,
  variant = "primary",
  darkVariant,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "clear" && "btn-clear",
        darkVariant && darkVariant === "primary" && "dark:btn-primary",
        darkVariant && darkVariant === "secondary" && "dark:btn-secondary",
        darkVariant && darkVariant === "clear" && "dark:btn-clear",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
