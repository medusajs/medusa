import * as React from "react"
import type { IconProps } from "../types"
const BugAntSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M11.945 8.833h2a.667.667 0 0 0 0-1.333h-2v-.964A3.114 3.114 0 0 0 14.389 3.5a.667.667 0 0 0-1.333 0 1.78 1.78 0 0 1-1.412 1.739 2.43 2.43 0 0 0-1.477-1.19V3.5A2.67 2.67 0 0 0 7.5.833 2.67 2.67 0 0 0 4.833 3.5v.548a2.44 2.44 0 0 0-1.477 1.19A1.78 1.78 0 0 1 1.944 3.5a.667.667 0 0 0-1.333 0 3.114 3.114 0 0 0 2.445 3.036V7.5h-2a.667.667 0 0 0 0 1.333h2v.445c0 .173.027.34.046.507a3.116 3.116 0 0 0-2.49 3.048.667.667 0 0 0 1.332 0c0-.89.66-1.622 1.514-1.75a4.45 4.45 0 0 0 3.375 2.572v-4.6a.667.667 0 0 1 1.334 0v4.6a4.45 4.45 0 0 0 3.375-2.573 1.776 1.776 0 0 1 1.514 1.751.667.667 0 0 0 1.333 0 3.116 3.116 0 0 0-2.49-3.048c.019-.168.046-.333.046-.507zM6.167 3.944V3.5c0-.735.598-1.333 1.333-1.333s1.333.598 1.333 1.333v.444z"
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
BugAntSolid.displayName = "BugAntSolid"
export default BugAntSolid
