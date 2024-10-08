import * as React from "react"
import type { IconProps } from "../types"
const ArrowLongLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.944 7.5h11.112M5.722 11.278 1.944 7.5l3.778-3.778"
        />
      </svg>
    )
  }
)
ArrowLongLeft.displayName = "ArrowLongLeft"
export default ArrowLongLeft
