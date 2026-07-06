import * as React from "react"
import type { IconProps } from "../types"
const ClockSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill={color}
          d="M7.5 1.5c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6m2.564 8.244a.75.75 0 0 1-1.058.07l-2-1.75A.75.75 0 0 1 6.75 7.5V4.75a.75.75 0 0 1 1.5 0v2.41l1.744 1.526a.75.75 0 0 1 .07 1.058"
        />
      </svg>
    )
  }
)
ClockSolid.displayName = "ClockSolid"
export default ClockSolid
