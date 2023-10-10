import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpRightMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m5.75 14.25 8.5-8.5m0 0h-7.5m7.5 0v7.5"
        />
      </svg>
    )
  }
)
ArrowUpRightMini.displayName = "ArrowUpRightMini"
export default ArrowUpRightMini
