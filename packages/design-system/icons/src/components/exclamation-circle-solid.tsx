import * as React from "react"
import type { IconProps } from "../types"
const ExclamationCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            fill={color}
            d="M7.5.389C3.58.389.389 3.579.389 7.5s3.19 7.111 7.111 7.111 7.111-3.19 7.111-7.111S11.421.389 7.5.389m-.667 3.939a.667.667 0 0 1 1.334 0v3.679a.667.667 0 0 1-1.334 0zm.667 7.098a.89.89 0 0 1 0-1.778.89.89 0 0 1 0 1.778"
          />
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
ExclamationCircleSolid.displayName = "ExclamationCircleSolid"
export default ExclamationCircleSolid
