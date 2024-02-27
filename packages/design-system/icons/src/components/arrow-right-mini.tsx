import * as React from "react"
import type { IconProps } from "../types"
const ArrowRightMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5 10h10m0 0-4.5-4.5M15 10l-4.5 4.5"
        />
      </svg>
    )
  }
)
ArrowRightMini.displayName = "ArrowRightMini"
export default ArrowRightMini
