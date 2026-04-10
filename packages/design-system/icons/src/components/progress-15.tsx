import * as React from "react"
import type { IconProps } from "../types"
const Progress15 = React.forwardRef<SVGSVGElement, IconProps>(
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
          <circle cx={7.5} cy={7.5} r={6.36} stroke={color} strokeWidth={1.5} />
          <path
            fill={color}
            d="M7.5 3.39a4.11 4.11 0 0 1 3.325 1.694L8.83 6.534a1.64 1.64 0 0 0-1.33-.678z"
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
Progress15.displayName = "Progress15"
export default Progress15
