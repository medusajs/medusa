import clsx from "clsx"
import React from "react"

export type SpinnerProps = {
  size?: "large" | "medium" | "small"
  variant?: "primary" | "secondary"
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "large",
  variant = "primary",
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        { "h-[24px] w-[24px]": size === "large" },
        { "h-[20px] w-[20px]": size === "medium" },
        { "h-[16px] w-[16px]": size === "small" }
      )}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className={clsx(
            "animate-ring rounded-circle h-4/5 w-4/5 border-2 border-transparent",
            { "border-t-grey-0": variant === "primary" },
            { "border-t-violet-60": variant === "secondary" }
          )}
        />
      </div>
    </div>
  )
}

export default Spinner
