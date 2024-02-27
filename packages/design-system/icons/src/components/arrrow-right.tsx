import * as React from "react"
import type { IconProps } from "../types"
const ArrrowRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.25 3.75 17.5 10m0 0-6.25 6.25M17.5 10h-15"
        />
      </svg>
    )
  }
)
ArrrowRight.displayName = "ArrrowRight"
export default ArrrowRight
