import clsx from "clsx"

export type ButtonProps = {
  isSelected?: boolean
  disabled?: boolean
  variant?: "primary" | "secondary"
  darkVariant?: "primary" | "secondary"
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
        darkVariant && darkVariant === "primary" && "dark:btn-primary",
        darkVariant && darkVariant === "secondary" && "dark:btn-secondary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
