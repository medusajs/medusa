import * as React from "react"
import type { IconProps } from "../types"
const ChevronDoubleLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.833 11.278 3.056 7.5l3.777-3.778M11.056 11.278 7.278 7.5l3.778-3.778"
        />
      </svg>
    )
  }
)
ChevronDoubleLeft.displayName = "ChevronDoubleLeft"
export default ChevronDoubleLeft
