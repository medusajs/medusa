import * as React from "react"
import type { IconProps } from "../types"
const ArrowLongLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.625 13.125 2.5 10m0 0 3.125-3.125M2.5 10h15"
        />
      </svg>
    )
  }
)
ArrowLongLeft.displayName = "ArrowLongLeft"
export default ArrowLongLeft
