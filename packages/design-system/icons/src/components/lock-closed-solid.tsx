import * as React from "react"
import type { IconProps } from "../types"
const LockClosedSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.75 7.5A.75.75 0 0 1 9 6.75V4.5C9 3.673 8.327 3 7.5 3S6 3.673 6 4.5v2.25a.75.75 0 0 1-1.5 0V4.5c0-1.654 1.346-3 3-3s3 1.346 3 3v2.25a.75.75 0 0 1-.75.75"
        />
        <path
          fill={color}
          d="M10.75 6h-6.5A2.25 2.25 0 0 0 2 8.25v3a2.25 2.25 0 0 0 2.25 2.25h6.5A2.25 2.25 0 0 0 13 11.25v-3A2.25 2.25 0 0 0 10.75 6m-2.5 4.25a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 1.5 0z"
        />
      </svg>
    )
  }
)
LockClosedSolid.displayName = "LockClosedSolid"
export default LockClosedSolid
