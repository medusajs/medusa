import * as React from "react"
import type { IconProps } from "../types"
const ChevronDown = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.056 5.278 7.5 10.833 1.944 5.278"
        />
      </svg>
    )
  }
)
ChevronDown.displayName = "ChevronDown"
export default ChevronDown
