import * as React from "react"
import type { IconProps } from "../types"
const CommandLineSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.875 5a2.5 2.5 0 0 1 2.5-2.5h11.25a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5H4.375a2.5 2.5 0 0 1-2.5-2.5V5Zm3.308.808a.625.625 0 0 1 .884 0l1.875 1.875a.625.625 0 0 1 0 .884l-1.875 1.875a.625.625 0 0 1-.884-.884l1.434-1.433-1.434-1.433a.625.625 0 0 1 0-.884ZM8.75 9.375a.625.625 0 0 0 0 1.25h2.5a.624.624 0 1 0 0-1.25h-2.5Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
CommandLineSolid.displayName = "CommandLineSolid"
export default CommandLineSolid
