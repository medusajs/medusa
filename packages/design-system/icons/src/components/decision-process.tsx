import * as React from "react"
import type { IconProps } from "../types"
const DecisionProcess = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.625 1.875H2.292a.833.833 0 0 0-.834.833v.834c0 .46.373.833.834.833h3.333c.46 0 .833-.373.833-.833v-.834a.833.833 0 0 0-.833-.833M5.625 10.625H2.292a.833.833 0 0 0-.834.833v.834c0 .46.373.833.834.833h3.333c.46 0 .833-.373.833-.833v-.834a.833.833 0 0 0-.833-.833M3.958 6.459v2.083M8.542 3.125h1.666c.46 0 .834.373.834.833v1.667M8.542 11.875h1.666c.46 0 .834-.373.834-.833V9.375M11.042 5.625 14.167 7.5l-3.125 1.875L7.917 7.5z"
        />
      </svg>
    )
  }
)
DecisionProcess.displayName = "DecisionProcess"
export default DecisionProcess
