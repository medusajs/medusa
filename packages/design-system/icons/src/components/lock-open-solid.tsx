import * as React from "react"
import type { IconProps } from "../types"
const LockOpenSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <g fill={color} clipPath="url(#a)">
          <path d="M6.833 7.5a.667.667 0 0 1-.666-.667V3.944a2.225 2.225 0 0 0-2.223-2.222 2.225 2.225 0 0 0-2.222 2.222v1.112a.667.667 0 0 1-1.333 0V3.944A3.56 3.56 0 0 1 3.944.39 3.56 3.56 0 0 1 7.5 3.944v2.89a.667.667 0 0 1-.667.666" />
          <path d="M12.167 6.167H5.5A2.446 2.446 0 0 0 3.056 8.61v3.556A2.446 2.446 0 0 0 5.5 14.61h6.667a2.446 2.446 0 0 0 2.444-2.444V8.61a2.446 2.446 0 0 0-2.444-2.444M9.5 10.833a.667.667 0 0 1-1.333 0v-.889a.667.667 0 0 1 1.333 0z" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
LockOpenSolid.displayName = "LockOpenSolid"
export default LockOpenSolid
