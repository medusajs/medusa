import * as React from "react"
import type { IconProps } from "../types"
const ArrowUturnLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.667 12.333 3.001 7.667m0 0 4.666-4.666M3.001 7.667h9.332a4.666 4.666 0 1 1 0 9.332H10"
        />
      </svg>
    )
  }
)
ArrowUturnLeft.displayName = "ArrowUturnLeft"
export default ArrowUturnLeft
