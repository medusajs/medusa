import * as React from "react"
import type { IconProps } from "../types"
const Adjustments = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeWidth={1.25}
          d="M8.75 5h8.125M8.75 5a1.25 1.25 0 0 1-2.5 0m2.5 0a1.25 1.25 0 0 0-2.5 0M3.125 5H6.25m2.5 10h8.125M8.75 15a1.25 1.25 0 0 1-2.5 0m2.5 0a1.25 1.25 0 0 0-2.5 0m-3.125 0H6.25m7.5-5h3.125m-3.125 0a1.25 1.25 0 0 1-2.5 0m2.5 0a1.25 1.25 0 0 0-2.5 0m-8.125 0h8.125"
        />
      </svg>
    )
  }
)
Adjustments.displayName = "Adjustments"
export default Adjustments
