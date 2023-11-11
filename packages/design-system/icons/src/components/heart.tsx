import * as React from "react"
import type { IconProps } from "../types"
const Heart = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M17.5 6.875c0-2.07-1.75-3.75-3.907-3.75-1.612 0-2.997.938-3.593 2.277-.596-1.339-1.98-2.277-3.594-2.277-2.156 0-3.906 1.68-3.906 3.75 0 6.017 7.5 10 7.5 10s7.5-3.983 7.5-10Z"
        />
      </svg>
    )
  }
)
Heart.displayName = "Heart"
export default Heart
