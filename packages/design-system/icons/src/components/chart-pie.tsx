import * as React from "react"
import type { IconProps } from "../types"
const ChartPie = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M13.368 10.167a6.446 6.446 0 1 1-8.535-8.535" />
          <path d="M13.944 7.5A6.444 6.444 0 0 0 7.5 1.056V7.5z" />
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
ChartPie.displayName = "ChartPie"
export default ChartPie
