import * as React from "react"
import type { IconProps } from "../types"
const ArrowRightOnRectangle = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.167 1.944h3.11c.983 0 1.779.796 1.779 1.778v7.556c0 .982-.796 1.778-1.778 1.778H8.167"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.5 10.611 8.611 7.5 5.5 4.389M8.611 7.5H1.944"
        />
      </svg>
    )
  }
)
ArrowRightOnRectangle.displayName = "ArrowRightOnRectangle"
export default ArrowRightOnRectangle
