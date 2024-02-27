import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 6.25 6.25 2.5m0 0L10 6.25M6.25 2.5v11.25m11.25 0-3.75 3.75m0 0L10 13.75m3.75 3.75V6.25"
        />
      </svg>
    )
  }
)
ArrowUpDown.displayName = "ArrowUpDown"
export default ArrowUpDown
