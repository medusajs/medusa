import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M7.5.389C3.58.389.389 3.579.389 7.5s3.19 7.111 7.111 7.111 7.111-3.19 7.111-7.111S11.421.389 7.5.389m2.693 6.915a.665.665 0 0 1-.942 0L8.167 6.22v4.168a.667.667 0 0 1-1.334 0V6.221L5.75 7.305a.667.667 0 1 1-.943-.943L7.028 4.14c.26-.26.683-.26.943 0l2.222 2.222c.26.26.26.683 0 .943"
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
ArrowUpCircleSolid.displayName = "ArrowUpCircleSolid"
export default ArrowUpCircleSolid
