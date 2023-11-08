import * as React from "react"
import type { IconProps } from "../types"
const ChevronLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.125 16.25 6.875 10l6.25-6.25"
        />
      </svg>
    )
  }
)
ChevronLeft.displayName = "ChevronLeft"
export default ChevronLeft
