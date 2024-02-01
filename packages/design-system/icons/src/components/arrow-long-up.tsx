import * as React from "react"
import type { IconProps } from "../types"
const ArrowLongUp = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.875 5.625 10 2.5m0 0 3.125 3.125M10 2.5v15"
        />
      </svg>
    )
  }
)
ArrowLongUp.displayName = "ArrowLongUp"
export default ArrowLongUp
