import * as React from "react"
import type { IconProps } from "../types"
const ChartActivity = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.944 7.278h-2.041a.89.89 0 0 0-.837.587l-1.464 4.067a.332.332 0 0 1-.627-.007l-2.95-8.85a.332.332 0 0 0-.627-.007L3.934 7.135a.89.89 0 0 1-.837.587H1.056"
        />
      </svg>
    )
  }
)
ChartActivity.displayName = "ChartActivity"
export default ChartActivity
