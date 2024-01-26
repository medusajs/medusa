import * as React from "react"
import type { IconProps } from "../types"
const LockOpenSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M8.056 10a.834.834 0 0 1-.834-.833V5.556a2.782 2.782 0 0 0-2.778-2.778 2.782 2.782 0 0 0-2.777 2.778v1.388a.834.834 0 0 1-1.667 0V5.556A4.449 4.449 0 0 1 4.444 1.11 4.449 4.449 0 0 1 8.89 5.556v3.61c0 .46-.373.834-.833.834Z" />
          <path d="M14.722 8.333H6.39a3.058 3.058 0 0 0-3.056 3.056v4.444A3.058 3.058 0 0 0 6.39 18.89h8.333a3.058 3.058 0 0 0 3.056-3.056V11.39a3.058 3.058 0 0 0-3.056-3.056Zm-3.333 5.834a.834.834 0 0 1-1.667 0v-1.111a.834.834 0 0 1 1.667 0v1.11Z" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h20v20H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
LockOpenSolid.displayName = "LockOpenSolid"
export default LockOpenSolid
