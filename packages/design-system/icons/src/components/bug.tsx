import * as React from "react"
import type { IconProps } from "../types"
const Bug = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.5 13.056v-4M5.5 4.611V3.5a2 2 0 1 1 4 0v1.111M3.722 8.167H1.056M3.722 5.944A2.444 2.444 0 0 1 1.278 3.5M3.722 10.389a2.444 2.444 0 0 0-2.444 2.444M11.278 8.167h2.666M11.278 5.944A2.444 2.444 0 0 0 13.722 3.5M11.278 10.389a2.444 2.444 0 0 1 2.444 2.444" />
          <path d="M5.5 4.611h4c.981 0 1.778.797 1.778 1.778v2.889A3.78 3.78 0 0 1 7.5 13.056a3.78 3.78 0 0 1-3.778-3.778v-2.89c0-.98.797-1.777 1.778-1.777" />
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
Bug.displayName = "Bug"
export default Bug
