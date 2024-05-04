import * as React from "react"
import type { IconProps } from "../types"
const Rss = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10.625 16.25v-.625a6.25 6.25 0 0 0-6.25-6.25H3.75m0-5.625h.625c6.558 0 11.875 5.317 11.875 11.875v.625M5 15.625a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z"
        />
      </svg>
    )
  }
)
Rss.displayName = "Rss"
export default Rss
