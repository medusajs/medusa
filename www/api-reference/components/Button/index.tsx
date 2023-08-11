import clsx from "clsx"

export type ButtonProps = {
  isSelected?: boolean
  disabled?: boolean
  variant?: "primary" | "secondary"
} & React.HTMLAttributes<HTMLButtonElement>

const Button = ({
  isSelected = false,
  className,
  children,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        // isSelected &&
        //   "bg-medusa-bg-interactive dark:bg-medusa-bg-interactive-dark text-medusa-text-on-color border-transparent",
        // !isSelected &&
        //   "bg-medusa-bg-base dark:bg-medusa-bg-base-dark border-medusa-border-base dark:border-medusa-border-base-dark",
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
