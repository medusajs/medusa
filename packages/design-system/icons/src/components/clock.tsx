import * as React from "react"
import type { IconProps } from "../types"
const Clock = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="m12.389.833 1.778 1.778M2.611.833.833 2.611M7.5 13.056a5.556 5.556 0 1 0 0-11.112 5.556 5.556 0 0 0 0 11.112M3.572 11.428l-1.628 1.627M11.428 11.428l1.627 1.627" />
          <path d="M7.5 4.611V7.5l2.444 1.556" />
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
Clock.displayName = "Clock"
export default Clock
