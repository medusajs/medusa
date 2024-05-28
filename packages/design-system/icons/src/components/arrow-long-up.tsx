import * as React from "react"
import type { IconProps } from "../types"
const ArrowLongUp = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.667 1.944v11.111M3.889 5.722l3.778-3.778 3.778 3.778"
        />
      </svg>
    )
  }
)
ArrowLongUp.displayName = "ArrowLongUp"
export default ArrowLongUp
