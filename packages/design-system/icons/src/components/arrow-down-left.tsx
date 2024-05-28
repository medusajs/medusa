import * as React from "react"
import type { IconProps } from "../types"
const ArrowDownLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.944 8.167h9.334c.982 0 1.778-.796 1.778-1.778V2.833"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.722 4.389 1.944 8.167l3.778 3.778"
        />
      </svg>
    )
  }
)
ArrowDownLeft.displayName = "ArrowDownLeft"
export default ArrowDownLeft
