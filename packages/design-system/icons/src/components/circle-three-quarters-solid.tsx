import * as React from "react"
import type { IconProps } from "../types"
const CircleThreeQuartersSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path
            fillRule="evenodd"
            d="M7.5 13.277a5.777 5.777 0 1 0 0-11.554 5.777 5.777 0 0 0 0 11.554m0 1.333A7.11 7.11 0 1 0 7.5.39a7.11 7.11 0 0 0 0 14.22"
            clipRule="evenodd"
          />
          <path d="M7.5 11.944a4.444 4.444 0 1 0 0-8.888V7.5H3.056c0 2.434 2.053 4.444 4.444 4.444" />
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
CircleThreeQuartersSolid.displayName = "CircleThreeQuartersSolid"
export default CircleThreeQuartersSolid
