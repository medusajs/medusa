import * as React from "react"
import type { IconProps } from "../types"
const BackwardSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M14.255 3.285a1 1 0 0 0-1-.014l-4.95 2.743V4.152a1 1 0 0 0-.495-.867 1 1 0 0 0-.999-.013L.77 6.619a1.008 1.008 0 0 0 0 1.762l6.041 3.347a1 1 0 0 0 1-.012 1 1 0 0 0 .495-.868V8.986l4.95 2.742a1 1 0 0 0 .999-.012 1 1 0 0 0 .495-.868V4.152a1 1 0 0 0-.495-.867"
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
BackwardSolid.displayName = "BackwardSolid"
export default BackwardSolid
