import * as React from "react"
import type { IconProps } from "../types"
const CircleInfoSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M7.5 1.5c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6m.75 8.5a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 1.5 0zM7.5 5.5a.877.877 0 0 1-.875-.875c0-.482.393-.875.875-.875s.875.393.875.875A.877.877 0 0 1 7.5 5.5"
        />
      </svg>
    )
  }
)
CircleInfoSolid.displayName = "CircleInfoSolid"
export default CircleInfoSolid
