import * as React from "react"
import type { IconProps } from "../types"
const Code = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="m4.167 10.611-3.111-3.11 3.11-3.112M10.833 10.611l3.111-3.11-3.11-3.112M6.167 13.055l2.666-11.11" />
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
Code.displayName = "Code"
export default Code
