import * as React from "react"
import type { IconProps } from "../types"
const PauseSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <rect
          width={3.5}
          height={13.75}
          x={4.75}
          y={3.125}
          fill={color}
          rx={1}
        />
        <rect
          width={3.5}
          height={13.75}
          x={11.75}
          y={3.125}
          fill={color}
          rx={1}
        />
      </svg>
    )
  }
)
PauseSolid.displayName = "PauseSolid"
export default PauseSolid
