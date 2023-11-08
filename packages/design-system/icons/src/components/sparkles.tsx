import * as React from "react"
import type { IconProps } from "../types"
const Sparkles = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.178 13.253 7.5 15.625l-.678-2.372a3.75 3.75 0 0 0-2.575-2.575L1.875 10l2.372-.678a3.75 3.75 0 0 0 2.575-2.574L7.5 4.374l.678 2.372a3.75 3.75 0 0 0 2.574 2.575l2.373.678-2.372.678a3.75 3.75 0 0 0-2.575 2.574v.001Zm7.038-5.99L15 8.124l-.216-.862a2.813 2.813 0 0 0-2.046-2.047L11.875 5l.863-.216a2.813 2.813 0 0 0 2.046-2.046L15 1.874l.216.862a2.813 2.813 0 0 0 2.046 2.047l.863.216-.863.216a2.812 2.812 0 0 0-2.046 2.046Zm-1.138 9.876-.328.986-.328-.986a1.875 1.875 0 0 0-1.186-1.186l-.986-.328.986-.328a1.875 1.875 0 0 0 1.186-1.186l.328-.986.328.986a1.875 1.875 0 0 0 1.186 1.186l.986.328-.986.328a1.875 1.875 0 0 0-1.186 1.186Z"
        />
      </svg>
    )
  }
)
Sparkles.displayName = "Sparkles"
export default Sparkles
