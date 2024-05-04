import * as React from "react"
import type { IconProps } from "../types"
const CloudArrowUp = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 13.75V8.125m0 0 2.5 2.5m-2.5-2.5-2.5 2.5M5.625 16.25A3.75 3.75 0 0 1 4.45 8.937a4.375 4.375 0 0 1 8.527-1.941 2.5 2.5 0 0 1 3.132 3.207A3.127 3.127 0 0 1 15 16.25H5.625Z"
        />
      </svg>
    )
  }
)
CloudArrowUp.displayName = "CloudArrowUp"
export default CloudArrowUp
