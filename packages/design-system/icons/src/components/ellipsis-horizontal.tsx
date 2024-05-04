import * as React from "react"
import type { IconProps } from "../types"
const EllipsisHorizontal = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.75 10a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Zm5.5 0a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Zm5.72-.53a.75.75 0 1 1 1.06 1.06.75.75 0 0 1-1.06-1.06Z"
        />
      </svg>
    )
  }
)
EllipsisHorizontal.displayName = "EllipsisHorizontal"
export default EllipsisHorizontal
