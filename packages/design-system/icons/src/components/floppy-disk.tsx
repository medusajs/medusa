import * as React from "react"
import type { IconProps } from "../types"
const FloppyDisk = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.056 1.5v2.667a.89.89 0 0 1-.89.889h-3.11a.89.89 0 0 1-.89-.89V1.5M4.167 13.5V9.055a.89.89 0 0 1 .889-.889h4.888a.89.89 0 0 1 .89.89V13.5"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.58 13.5H3.42a1.92 1.92 0 0 1-1.92-1.92V3.42c0-1.06.86-1.92 1.92-1.92h6.6c.236 0 .463.093.63.26l2.59 2.59c.167.168.26.394.26.63v6.6c0 1.06-.86 1.92-1.92 1.92"
        />
      </svg>
    )
  }
)
FloppyDisk.displayName = "FloppyDisk"
export default FloppyDisk
