import * as React from "react"
import type { IconProps } from "../types"
const WIP = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 13.945a6.444 6.444 0 1 0 0-12.89 6.444 6.444 0 0 0 0 12.89"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.722 3.745v3.977L5.075 10.37c.655.56 1.495.909 2.425.909A3.78 3.78 0 0 0 11.278 7.5c0-2.007-1.578-3.638-3.556-3.755"
        />
      </svg>
    )
  }
)
WIP.displayName = "WIP"
export default WIP
