import * as React from "react"
import type { IconProps } from "../types"
const ArrowDownLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.502 8.333 3.335 12.5l4.167 4.166"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16.668 3.333v5.833a3.333 3.333 0 0 1-3.333 3.334h-10"
        />
      </svg>
    )
  }
)
ArrowDownLeft.displayName = "ArrowDownLeft"
export default ArrowDownLeft
