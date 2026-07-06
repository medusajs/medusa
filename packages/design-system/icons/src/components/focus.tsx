import * as React from "react"
import type { IconProps } from "../types"
const Focus = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4M1.944 5.5V3.722c0-.982.796-1.778 1.778-1.778H5.5M9.5 1.944h1.778c.982 0 1.778.796 1.778 1.778V5.5M13.056 9.5v1.778c0 .982-.796 1.778-1.778 1.778H9.5M5.5 13.056H3.722a1.777 1.777 0 0 1-1.778-1.778V9.5"
        />
      </svg>
    )
  }
)
Focus.displayName = "Focus"
export default Focus
