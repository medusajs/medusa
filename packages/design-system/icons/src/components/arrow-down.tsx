import * as React from "react"
import type { IconProps } from "../types"
const ArrowDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M16.25 11.25 10 17.5m0 0-6.25-6.25M10 17.5v-15"
        />
      </svg>
    )
  }
)
ArrowDown.displayName = "ArrowDown"
export default ArrowDown
