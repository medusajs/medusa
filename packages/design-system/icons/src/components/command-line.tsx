import * as React from "react"
import type { IconProps } from "../types"
const CommandLine = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m5.625 6.25 2.5 1.875L5.625 10m3.75 0h2.5m-7.5 6.875h11.25A1.875 1.875 0 0 0 17.5 15V5a1.875 1.875 0 0 0-1.875-1.875H4.375A1.875 1.875 0 0 0 2.5 5v10a1.875 1.875 0 0 0 1.875 1.875Z"
        />
      </svg>
    )
  }
)
CommandLine.displayName = "CommandLine"
export default CommandLine
