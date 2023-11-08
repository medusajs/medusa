import * as React from "react"
import type { IconProps } from "../types"
const ChevronDoubleLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M15.625 16.25 9.375 10l6.25-6.25m-5 12.5L4.375 10l6.25-6.25"
        />
      </svg>
    )
  }
)
ChevronDoubleLeft.displayName = "ChevronDoubleLeft"
export default ChevronDoubleLeft
