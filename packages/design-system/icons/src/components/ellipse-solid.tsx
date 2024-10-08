import * as React from "react"
import type { IconProps } from "../types"
const EllipseSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M7.5 14.611A7.111 7.111 0 1 0 7.5.39a7.111 7.111 0 0 0 0 14.222"
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
EllipseSolid.displayName = "EllipseSolid"
export default EllipseSolid
