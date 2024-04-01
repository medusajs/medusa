import { clx } from "@medusajs/ui"
import { ComponentPropsWithoutRef } from "react"

interface DividerProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  orientation?: "horizontal" | "vertical"
  variant?: "dashed" | "solid"
}

export const Divider = ({
  orientation = "horizontal",
  variant = "solid",
  className,
  ...props
}: DividerProps) => {
  return (
    <div
      aria-orientation={orientation}
      role="separator"
      className={clx(
        {
          "w-full border-t": orientation === "horizontal",
          "h-full border-l": orientation === "vertical",
          "border-dashed": variant === "dashed",
        },
        className
      )}
      {...props}
    />
  )
}
