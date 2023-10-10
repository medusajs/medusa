import * as React from "react"
import type { IconProps } from "../types"
const ArrowPath = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.352 7.79h4.16v0M2.489 16.37v-4.16m0 0h4.16m-4.161 0 2.65 2.652A6.874 6.874 0 0 0 16.64 11.78M3.36 8.221a6.875 6.875 0 0 1 11.502-3.083l2.65 2.651m0-4.159v4.158"
        />
      </svg>
    )
  }
)
ArrowPath.displayName = "ArrowPath"
export default ArrowPath
