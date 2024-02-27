import * as React from "react"
import type { IconProps } from "../types"
const ArrowLongDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.125 14.375 10 17.5m0 0-3.125-3.125M10 17.5v-15"
        />
      </svg>
    )
  }
)
ArrowLongDown.displayName = "ArrowLongDown"
export default ArrowLongDown
