import * as React from "react"
import type { IconProps } from "../types"
const ChevronDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M16.25 6.875 10 13.125l-6.25-6.25"
        />
      </svg>
    )
  }
)
ChevronDown.displayName = "ChevronDown"
export default ChevronDown
