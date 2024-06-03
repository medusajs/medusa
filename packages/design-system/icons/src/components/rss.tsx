import * as React from "react"
import type { IconProps } from "../types"
const Rss = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.05 13v-.55a5.5 5.5 0 0 0-5.5-5.5H2M2 2h.55C8.321 2 13 6.679 13 12.45V13m-9.9-.55a.55.55 0 1 1-1.1 0 .55.55 0 0 1 1.1 0"
        />
      </svg>
    )
  }
)
Rss.displayName = "Rss"
export default Rss
