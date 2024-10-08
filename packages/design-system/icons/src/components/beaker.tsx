import * as React from "react"
import type { IconProps } from "../types"
const Beaker = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.005 9.5h6.99M5.944 1.056v4.666l-3.224 6.28a1.333 1.333 0 0 0 1.185 1.943h7.19a1.333 1.333 0 0 0 1.185-1.943l-3.224-6.28V1.056M4.611 1.056h5.778"
        />
      </svg>
    )
  }
)
Beaker.displayName = "Beaker"
export default Beaker
