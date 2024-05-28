import * as React from "react"
import type { IconProps } from "../types"
const Check = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m3.036 7.679 2.857 3.571 6.071-7.5"
        />
      </svg>
    )
  }
)
Check.displayName = "Check"
export default Check
