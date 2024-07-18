import * as React from "react"
import type { IconProps } from "../types"
const AdjustmentsDone = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M8.5 2.528h-.778a.75.75 0 1 0 0 1.5h1.08a4 4 0 0 1-.302-1.5M10.695 6.07a4 4 0 0 1-1.21-.94.75.75 0 0 0-.29.592V6.75H1.5a.75.75 0 0 0 0 1.5h7.694v1.028a.75.75 0 0 0 1.5 0zM5.806 1.5a.75.75 0 1 0-1.5 0v1.028H1.5a.75.75 0 0 0 0 1.5h2.806v1.028a.75.75 0 0 0 1.5 0V1.5M12.611 6.75a.75.75 0 0 0 0 1.5h.889a.75.75 0 0 0 0-1.5zM6.972 11.722a.75.75 0 0 1 .75-.75H13.5a.75.75 0 1 1 0 1.5H7.722a.75.75 0 0 1-.75-.75M1.5 10.972a.75.75 0 0 0 0 1.5h2.806V13.5a.75.75 0 0 0 1.5 0V9.944a.75.75 0 1 0-1.5 0v1.028z"
          />
          <circle cx={12.5} cy={2.5} r={2.5} fill="#60A5FA" />
          <circle
            cx={12.5}
            cy={2.5}
            r={2}
            stroke={color}
            strokeOpacity={0.12}
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
AdjustmentsDone.displayName = "AdjustmentsDone"
export default AdjustmentsDone
