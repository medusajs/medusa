import * as React from "react"
import type { IconProps } from "../types"
const CloudArrowUp = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M10.167 11.722h.444a3.333 3.333 0 0 0 3.333-3.333 3.324 3.324 0 0 0-2.476-3.208C11.303 3.124 9.6 1.5 7.5 1.5a4 4 0 0 0-4 4c0 .311.044.61.11.9a2.66 2.66 0 0 0 .112 5.322h1.111" />
          <path d="m5.5 8.833 2-2 2 2M7.5 6.833v7.2" />
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
CloudArrowUp.displayName = "CloudArrowUp"
export default CloudArrowUp
