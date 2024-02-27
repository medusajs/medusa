import * as React from "react"
import type { IconProps } from "../types"
const ChevronUpDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m6 12.75 3.75 3.75 3.75-3.75m-7.5-6L9.75 3l3.75 3.75"
        />
      </svg>
    )
  }
)
ChevronUpDown.displayName = "ChevronUpDown"
export default ChevronUpDown
