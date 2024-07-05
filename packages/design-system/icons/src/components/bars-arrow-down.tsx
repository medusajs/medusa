import * as React from "react"
import type { IconProps } from "../types"
const BarsArrowDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 3.75h11.875M2.5 7.5h8.125M2.5 11.25h8.125m3.75-3.75v10m0 0-3.125-3.125m3.125 3.125 3.125-3.125"
        />
      </svg>
    )
  }
)
BarsArrowDown.displayName = "BarsArrowDown"
export default BarsArrowDown
