import * as React from "react"
import type { IconProps } from "../types"
const ArrowLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.75 16.25 2.5 10m0 0 6.25-6.25M2.5 10h15"
        />
      </svg>
    )
  }
)
ArrowLeft.displayName = "ArrowLeft"
export default ArrowLeft
