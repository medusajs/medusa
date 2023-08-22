import clsx from "clsx"
import { HTMLAttributes, FC } from "react"

type StatusIndicatorProps = {
  title?: string
  variant: "primary" | "danger" | "warning" | "success" | "active" | "default"
} & HTMLAttributes<HTMLDivElement>

const StatusIndicator: FC<StatusIndicatorProps> = ({
  title,
  variant = "success",
  className,
  ...props
}) => {
  const dotClass = clsx({
    "bg-teal-50": variant === "success",
    "bg-rose-50": variant === "danger",
    "bg-yellow-50": variant === "warning",
  })
  return (
    <div
      className={clsx("inter-small-regular flex items-center", className, {
        "hover:bg-grey-5 cursor-pointer": !!props.onClick,
      })}
      {...props}
    >
      <div className={clsx("h-1.5 w-1.5 self-center rounded-full", dotClass)} />
      {title && <span className="ml-2">{title}</span>}
    </div>
  )
}

export default StatusIndicator
