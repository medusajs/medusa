import clsx from "clsx"

export type ButtonProps = {
  isSelected?: boolean
} & React.HTMLAttributes<HTMLButtonElement>

const Button = ({
  isSelected = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "text-medusa-text-base dark:text-medusa-text-base-dark rounded border p-0.5",
        isSelected &&
          "bg-medusa-bg-interactive dark:bg-medusa-bg-interactive-dark text-medusa-text-on-color border-transparent",
        !isSelected &&
          "bg-medusa-bg-base dark:bg-medusa-bg-base-dark border-medusa-border-base dark:border-medusa-border-base-dark",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button