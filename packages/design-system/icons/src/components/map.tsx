import * as React from "react"
import type { IconProps } from "../types"
const Map = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 5.625V12.5m5-5v6.875m.42 2.915 4.062-2.03a.937.937 0 0 0 .518-.84V4.018a.937.937 0 0 0-1.357-.839L12.92 4.79a.934.934 0 0 1-.838 0L7.919 2.71a.937.937 0 0 0-.838 0L3.018 4.74a.937.937 0 0 0-.518.84v10.403a.937.937 0 0 0 1.357.839L7.08 15.21a.934.934 0 0 1 .838 0l4.162 2.08a.939.939 0 0 0 .838 0v0Z"
        />
      </svg>
    )
  }
)
Map.displayName = "Map"
export default Map
