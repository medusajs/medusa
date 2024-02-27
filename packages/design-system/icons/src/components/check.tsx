import * as React from "react"
import type { IconProps } from "../types"
const Check = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m3.75 10.625 5 5 7.5-11.25"
        />
      </svg>
    )
  }
)
Check.displayName = "Check"
export default Check
