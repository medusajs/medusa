import * as React from "react"
import type { IconProps } from "../types"
const ChevronDownMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m15 8-5 5-5-5"
        />
      </svg>
    )
  }
)
ChevronDownMini.displayName = "ChevronDownMini"
export default ChevronDownMini
