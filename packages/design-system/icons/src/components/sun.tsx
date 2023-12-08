import * as React from "react"
import type { IconProps } from "../types"
const Sun = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 2.5v1.875m5.303.322-1.326 1.325M17.5 10h-1.875m-.322 5.303-1.326-1.326M10 15.625V17.5m-3.978-3.523-1.325 1.326M4.375 10H2.5m3.522-3.978L4.697 4.697M13.125 10a3.125 3.125 0 1 1-6.25 0 3.125 3.125 0 0 1 6.25 0Z"
        />
      </svg>
    )
  }
)
Sun.displayName = "Sun"
export default Sun
