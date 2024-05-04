import * as React from "react"
import type { IconProps } from "../types"
const PlusMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 5v10m5-5H5"
        />
      </svg>
    )
  }
)
PlusMini.displayName = "PlusMini"
export default PlusMini
