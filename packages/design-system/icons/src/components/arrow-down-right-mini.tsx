import * as React from "react"
import type { IconProps } from "../types"
const ArrowDownRightMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.056 8.167H3.722a1.777 1.777 0 0 1-1.778-1.778V2.833"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m9.278 4.389 3.778 3.778-3.778 3.778"
        />
      </svg>
    )
  }
)
ArrowDownRightMini.displayName = "ArrowDownRightMini"
export default ArrowDownRightMini
