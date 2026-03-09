import * as React from "react"
import type { IconProps } from "../types"
const CircleXmarkSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 1.5c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6m2.53 7.47a.75.75 0 0 1-1.06 1.061L7.5 8.561l-1.47 1.47a.75.75 0 0 1-1.06 0 .75.75 0 0 1 0-1.061L6.44 7.5 4.97 6.03a.75.75 0 1 1 1.061-1.061l1.47 1.47 1.47-1.47a.75.75 0 1 1 1.061 1.061L8.562 7.5l1.47 1.47z"
        />
      </svg>
    )
  }
)
CircleXmarkSolid.displayName = "CircleXmarkSolid"
export default CircleXmarkSolid
