import * as React from "react"
import type { IconProps } from "../types"
const Stopwatch = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.625 1.042h3.75M7.5 1.042v2.083M7.5 13.542a5.208 5.208 0 1 0 0-10.417 5.208 5.208 0 0 0 0 10.417M5.585 6.418 7.5 8.333M11.875 2.292l1.667 1.666"
        />
      </svg>
    )
  }
)
Stopwatch.displayName = "Stopwatch"
export default Stopwatch
