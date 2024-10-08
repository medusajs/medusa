import * as React from "react"
import type { IconProps } from "../types"
const BarsThree = React.forwardRef<SVGSVGElement, IconProps>(
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
          <g
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            clipPath="url(#b)"
          >
            <path d="M1.5 7.5h12M1.5 2.833h12M1.5 12.167h12" />
          </g>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
          <clipPath id="b">
            <path fill="#fff" d="M-.5-.5h16v16h-16z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
BarsThree.displayName = "BarsThree"
export default BarsThree
