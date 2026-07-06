import * as React from "react"
import type { IconProps } from "../types"
const CircleHalfDottedClock = React.forwardRef<SVGSVGElement, IconProps>(
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
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7.5 3.722V7.5l2.889 2"
          />
          <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7.5 1.056a6.444 6.444 0 0 1 0 12.889"
          />
          <path
            fill={color}
            d="M3.026 12.808a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M1.139 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M3.026 3.692a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5.118 14.204a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M1.63 10.716a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M1.63 5.784a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M5.118 2.296a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
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
CircleHalfDottedClock.displayName = "CircleHalfDottedClock"
export default CircleHalfDottedClock
