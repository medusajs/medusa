import * as React from "react"

import { clx } from "@/utils/clx"
import {
  EllipseBlueSolid,
  EllipseGreenSolid,
  EllipseGreySolid,
  EllipseOrangeSolid,
  EllipsePurpleSolid,
  EllipseRedSolid,
} from "@medusajs/icons"

interface StatusBadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "color"> {
  color?: "green" | "red" | "blue" | "orange" | "grey" | "purple"
}

/**
 * This component is based on the span element and supports all of its props
 */
const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ 
    children, 
    className, 
    /**
     * The status's color.
     */
    color = "grey", 
    ...props 
  }: StatusBadgeProps, ref) => {
    const StatusIndicator = {
      green: EllipseGreenSolid,
      red: EllipseRedSolid,
      orange: EllipseOrangeSolid,
      blue: EllipseBlueSolid,
      purple: EllipsePurpleSolid,
      grey: EllipseGreySolid,
    }[color]

    return (
      <span
        ref={ref}
        className={clx(
          "bg-ui-bg-base border-ui-border-base txt-compact-small text-ui-fg-base inline-flex items-center justify-center rounded-full border py-1 pl-1 pr-3",
          className
        )}
        {...props}
      >
        <StatusIndicator className="mr-0.5" />
        {children}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge }
