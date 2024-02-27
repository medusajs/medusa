import * as React from "react"
import type { IconProps } from "../types"
const BackwardSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M7.662 14.742A1.563 1.563 0 0 0 10 13.384v-1.95l5.787 3.307a1.562 1.562 0 0 0 2.338-1.357V6.615c0-1.2-1.296-1.951-2.338-1.356L10 8.567v-1.95c0-1.2-1.296-1.953-2.338-1.358L1.74 8.644a1.562 1.562 0 0 0 0 2.714l5.923 3.384Z"
        />
      </svg>
    )
  }
)
BackwardSolid.displayName = "BackwardSolid"
export default BackwardSolid
