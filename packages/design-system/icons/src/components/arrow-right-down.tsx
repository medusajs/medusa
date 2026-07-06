import * as React from "react"
import type { IconProps } from "../types"
const ArrowRightDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.167 13.056V3.723c0-.983-.796-1.778-1.778-1.778H2.833"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m4.389 9.278 3.778 3.778 3.778-3.778"
        />
      </svg>
    )
  }
)
ArrowRightDown.displayName = "ArrowRightDown"
export default ArrowRightDown
