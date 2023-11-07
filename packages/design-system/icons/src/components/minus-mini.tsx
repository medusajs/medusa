import * as React from "react"
import type { IconProps } from "../types"
const MinusMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.375 10h-8.75"
        />
      </svg>
    )
  }
)
MinusMini.displayName = "MinusMini"
export default MinusMini
