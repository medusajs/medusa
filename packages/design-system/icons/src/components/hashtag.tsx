import * as React from "react"
import type { IconProps } from "../types"
const Hashtag = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.333 7.5h13.334M3.333 12.5h13.334M8.333 2.5l-1.666 15M13.333 2.5l-1.666 15"
        />
      </svg>
    )
  }
)
Hashtag.displayName = "Hashtag"
export default Hashtag
