import * as React from "react"
import type { IconProps } from "../types"
const ChevronLeftMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.25 3.25 5 7.5l4.25 4.25"
        />
      </svg>
    )
  }
)
ChevronLeftMini.displayName = "ChevronLeftMini"
export default ChevronLeftMini
