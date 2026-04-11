import * as React from "react"
import type { IconProps } from "../types"
const ChevronRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.75 11.75 10 7.5 5.75 3.25"
        />
      </svg>
    )
  }
)
ChevronRight.displayName = "ChevronRight"
export default ChevronRight
