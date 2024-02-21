import * as React from "react"
import type { IconProps } from "../types"
const ChartPie = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.75 5A6.25 6.25 0 1 0 15 11.25H8.75V5Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.25 8.75h6.25a6.25 6.25 0 0 0-6.25-6.25v6.25Z"
        />
      </svg>
    )
  }
)
ChartPie.displayName = "ChartPie"
export default ChartPie
