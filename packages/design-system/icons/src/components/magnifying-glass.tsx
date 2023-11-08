import * as React from "react"
import type { IconProps } from "../types"
const MagnifyingGlass = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m17.5 17.5-4.33-4.33m0 0a6.25 6.25 0 1 0-8.84-8.84 6.25 6.25 0 0 0 8.84 8.84v0Z"
        />
      </svg>
    )
  }
)
MagnifyingGlass.displayName = "MagnifyingGlass"
export default MagnifyingGlass
