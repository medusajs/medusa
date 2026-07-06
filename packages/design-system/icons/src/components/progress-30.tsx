import * as React from "react"
import type { IconProps } from "../types"
const Progress30 = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M7.5 3.39a4.11 4.11 0 0 1 3.909 5.38l-2.346-.762A1.644 1.644 0 0 0 7.5 5.856z"
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
Progress30.displayName = "Progress30"
export default Progress30
