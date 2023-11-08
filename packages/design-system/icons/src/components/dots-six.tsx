import * as React from "react"
import type { IconProps } from "../types"
const DotsSix = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 10.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM7.5 5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.5 10.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.5 5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        />
      </svg>
    )
  }
)
DotsSix.displayName = "DotsSix"
export default DotsSix
