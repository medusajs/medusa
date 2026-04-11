import * as React from "react"
import type { IconProps } from "../types"
const MarginTopBottom = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.944 13.056h11.112M10.389 9.5v-4a.89.89 0 0 0-.889-.889h-4a.89.89 0 0 0-.889.89v4c0 .49.398.888.889.888h4c.49 0 .889-.398.889-.889M1.944 1.944h11.112"
        />
      </svg>
    )
  }
)
MarginTopBottom.displayName = "MarginTopBottom"
export default MarginTopBottom
