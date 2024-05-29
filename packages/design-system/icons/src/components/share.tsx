import * as React from "react"
import type { IconProps } from "../types"
const Share = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m4.802 6.53 4.506-2.504M4.802 8.47l4.506 2.504M3.056 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4M11.056 5.056a2 2 0 1 0 0-4 2 2 0 0 0 0 4M11.056 13.944a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
        />
      </svg>
    )
  }
)
Share.displayName = "Share"
export default Share
