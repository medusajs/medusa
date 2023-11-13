import * as React from "react"
import type { IconProps } from "../types"
const ArrowLongRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.375 6.875 17.5 10m0 0-3.125 3.125M17.5 10h-15"
        />
      </svg>
    )
  }
)
ArrowLongRight.displayName = "ArrowLongRight"
export default ArrowLongRight
