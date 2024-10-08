import * as React from "react"
import type { IconProps } from "../types"
const ChevronDownMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          <g clipPath="url(#b)">
            <path
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.056 5.278 7.5 10.833 1.944 5.278"
            />
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
ChevronDownMini.displayName = "ChevronDownMini"
export default ChevronDownMini
