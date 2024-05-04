import * as React from "react"
import type { IconProps } from "../types"
const ArrowDownLeftMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8 8.667 4.667 12 8 15.333"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.333 4.667v4.666A2.667 2.667 0 0 1 12.667 12h-8"
        />
      </svg>
    )
  }
)
ArrowDownLeftMini.displayName = "ArrowDownLeftMini"
export default ArrowDownLeftMini
