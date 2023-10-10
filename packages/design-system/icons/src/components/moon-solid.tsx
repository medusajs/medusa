import * as React from "react"
import type { IconProps } from "../types"
const MoonSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.75 2.173a.593.593 0 0 1 .128.647 7.11 7.11 0 0 0 9.302 9.301.593.593 0 0 1 .775.775A8.297 8.297 0 0 1 10.295 18 8.296 8.296 0 0 1 7.105 2.045a.593.593 0 0 1 .646.128Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
MoonSolid.displayName = "MoonSolid"
export default MoonSolid
