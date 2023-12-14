import * as React from "react"
import type { IconProps } from "../types"
const ClockSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M1.75 10a8.25 8.25 0 1 1 16.5 0 8.25 8.25 0 0 1-16.5 0ZM10 5.083a.75.75 0 0 1 .75.75v3.944l2.128 1.242a.75.75 0 1 1-.756 1.295l-2.5-1.458a.75.75 0 0 1-.372-.648V5.833a.75.75 0 0 1 .75-.75Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ClockSolid.displayName = "ClockSolid"
export default ClockSolid
