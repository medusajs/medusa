import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16.001A8 8 0 0 0 10 18Zm-.75-4.75a.75.75 0 1 0 1.5 0V8.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L6.2 9.74a.75.75 0 0 0 1.1 1.02l1.95-2.1v4.59Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ArrowUpCircleSolid.displayName = "ArrowUpCircleSolid"
export default ArrowUpCircleSolid
