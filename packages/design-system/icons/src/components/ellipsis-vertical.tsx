import * as React from "react"
import type { IconProps } from "../types"
const EllipsisVertical = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeWidth={1.5}
          d="M10 3.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm0 5.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm.53 5.72a.75.75 0 1 1-1.06 1.06.75.75 0 0 1 1.06-1.06Z"
        />
      </svg>
    )
  }
)
EllipsisVertical.displayName = "EllipsisVertical"
export default EllipsisVertical
