import * as React from "react"
import type { IconProps } from "../types"
const ArrowDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.667 13.056V1.944M11.445 9.278l-3.778 3.778-3.778-3.778"
        />
      </svg>
    )
  }
)
ArrowDown.displayName = "ArrowDown"
export default ArrowDown
