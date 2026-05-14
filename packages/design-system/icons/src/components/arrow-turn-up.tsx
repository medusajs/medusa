import * as React from "react"
import type { IconProps } from "../types"
const ArrowTurnUp = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.167 1.944v9.334c0 .982-.796 1.777-1.778 1.777H2.833"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m4.389 5.722 3.778-3.778 3.778 3.778"
        />
      </svg>
    )
  }
)
ArrowTurnUp.displayName = "ArrowTurnUp"
export default ArrowTurnUp
