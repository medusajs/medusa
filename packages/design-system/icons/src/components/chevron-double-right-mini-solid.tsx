import * as React from "react"
import type { IconProps } from "../types"
const ChevronDoubleRightMiniSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M8.167 3.722 11.944 7.5l-3.777 3.778M3.944 3.722 7.722 7.5l-3.778 3.778" />
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
ChevronDoubleRightMiniSolid.displayName = "ChevronDoubleRightMiniSolid"
export default ChevronDoubleRightMiniSolid
