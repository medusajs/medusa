import * as React from "react"
import type { IconProps } from "../types"
const CircleMiniFilledSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <circle
            cx={7.5}
            cy={7.5}
            r={6.443}
            stroke={color}
            strokeWidth={1.333}
          />
          <circle cx={7.5} cy={7.5} r={4.444} fill={color} />
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
CircleMiniFilledSolid.displayName = "CircleMiniFilledSolid"
export default CircleMiniFilledSolid
