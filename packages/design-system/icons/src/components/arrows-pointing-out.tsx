import * as React from "react"
import type { IconProps } from "../types"
const ArrowsPointingOut = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.125 16.875v-3.75m0 3.75h3.75m-3.75 0L7.5 12.5m9.375-9.375h-3.75m3.75 0v3.75m0-3.75L12.5 7.5"
        />
      </svg>
    )
  }
)
ArrowsPointingOut.displayName = "ArrowsPointingOut"
export default ArrowsPointingOut
