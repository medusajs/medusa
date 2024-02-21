import * as React from "react"
import type { IconProps } from "../types"
const Stopwatch = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.75 2.25h4.5M10 2.25v2.5M10 17.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5ZM7.702 8.702 10 11M15.25 3.75l2 2"
        />
      </svg>
    )
  }
)
Stopwatch.displayName = "Stopwatch"
export default Stopwatch
