import clsx from "clsx"

export type ButtonProps = {
  isSelected?: boolean
  disabled?: boolean
  variant?: "primary" | "secondary"
} & React.HTMLAttributes<HTMLButtonElement>

const Button = ({
  className,
  children,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
