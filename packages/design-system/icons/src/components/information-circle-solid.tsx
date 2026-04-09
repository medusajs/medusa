import * as React from "react"
import type { IconProps } from "../types"
const InformationCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <g clipPath="url(#a)">
          <path
            fill={color}
            d="M7.5.389A7.12 7.12 0 0 0 .389 7.5 7.12 7.12 0 0 0 7.5 14.611 7.12 7.12 0 0 0 14.611 7.5c0-3.921-3.19-7.111-7.111-7.111m.667 10.444a.667.667 0 0 1-1.334 0V7.944H6.39a.667.667 0 0 1 0-1.333h.667c.612 0 1.11.498 1.11 1.111zM7.5 5.5a.89.89 0 0 1 0-1.778.89.89 0 0 1 0 1.778"
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
InformationCircleSolid.displayName = "InformationCircleSolid"
export default InformationCircleSolid
