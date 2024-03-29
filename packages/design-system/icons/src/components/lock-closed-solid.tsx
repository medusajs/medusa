import * as React from "react"
import type { IconProps } from "../types"
const LockClosedSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.611 10a.834.834 0 0 1-.833-.833V5.556A2.782 2.782 0 0 0 10 2.778a2.782 2.782 0 0 0-2.778 2.778v3.61a.834.834 0 0 1-1.666 0v-3.61A4.449 4.449 0 0 1 10 1.11a4.449 4.449 0 0 1 4.444 4.445v3.61c0 .46-.373.834-.833.834Z"
        />
        <path
          fill={color}
          d="M14.167 8.333H5.833a3.058 3.058 0 0 0-3.055 3.056v4.444a3.058 3.058 0 0 0 3.055 3.056h8.334a3.058 3.058 0 0 0 3.055-3.056V11.39a3.058 3.058 0 0 0-3.055-3.056Zm-3.334 5.834a.834.834 0 0 1-1.666 0v-1.111a.834.834 0 0 1 1.666 0v1.11Z"
        />
      </svg>
    )
  }
)
LockClosedSolid.displayName = "LockClosedSolid"
export default LockClosedSolid
