import * as React from "react"
import type { IconProps } from "../types"
const MinusMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 7.5h10"
        />
      </svg>
    )
  }
)
MinusMini.displayName = "MinusMini"
export default MinusMini
