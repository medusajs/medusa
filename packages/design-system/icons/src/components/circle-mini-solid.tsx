import * as React from "react"
import type { IconProps } from "../types"
const CircleMiniSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
            fillRule="evenodd"
            d="M7.5 1.722a5.778 5.778 0 1 0 0 11.556 5.778 5.778 0 0 0 0-11.556M.389 7.5a7.111 7.111 0 1 1 14.222 0A7.111 7.111 0 0 1 .39 7.5"
            clipRule="evenodd"
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
CircleMiniSolid.displayName = "CircleMiniSolid"
export default CircleMiniSolid
