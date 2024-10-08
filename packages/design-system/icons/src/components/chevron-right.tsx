import * as React from "react"
import type { IconProps } from "../types"
const ChevronRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.278 1.944 10.833 7.5l-5.555 5.555"
        />
      </svg>
    )
  }
)
ChevronRight.displayName = "ChevronRight"
export default ChevronRight
