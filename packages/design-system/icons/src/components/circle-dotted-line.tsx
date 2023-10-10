import * as React from "react"
import type { IconProps } from "../types"
const CircleDottedLine = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.5 2.936a7.387 7.387 0 0 0-5 0M2.63 8.632a7.484 7.484 0 0 1 2.5-4.33M5.13 15.698a7.485 7.485 0 0 1-2.5-4.33M7.5 17.064a7.387 7.387 0 0 0 5 0M17.37 8.632a7.484 7.484 0 0 0-2.501-4.33M14.869 15.698a7.485 7.485 0 0 0 2.5-4.33"
        />
      </svg>
    )
  }
)
CircleDottedLine.displayName = "CircleDottedLine"
export default CircleDottedLine
