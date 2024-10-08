import * as React from "react"
import type { IconProps } from "../types"
const ArrowUturnLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M1.5 5.056h8.667a3.333 3.333 0 0 1 0 6.666H6.833" />
          <path d="M4.611 8.167 1.5 5.056l3.111-3.112" />
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
ArrowUturnLeft.displayName = "ArrowUturnLeft"
export default ArrowUturnLeft
