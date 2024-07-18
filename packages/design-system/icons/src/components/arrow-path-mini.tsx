import * as React from "react"
import type { IconProps } from "../types"
const ArrowPathMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M4.752 9.616 1.935 8.86l-.755 2.817" />
          <path d="M13.136 8.53a5.729 5.729 0 0 1-11.196.357M10.248 5.384l2.817.755.755-2.817" />
          <path d="M1.864 6.469a5.729 5.729 0 0 1 11.184-.403" />
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
ArrowPathMini.displayName = "ArrowPathMini"
export default ArrowPathMini
