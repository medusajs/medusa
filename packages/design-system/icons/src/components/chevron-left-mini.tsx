import * as React from "react"
import type { IconProps } from "../types"
const ChevronLeftMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.722 13.055 4.167 7.5l5.555-5.556"
        />
      </svg>
    )
  }
)
ChevronLeftMini.displayName = "ChevronLeftMini"
export default ChevronLeftMini
