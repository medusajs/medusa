import * as React from "react"
import type { IconProps } from "../types"
const Moon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M18.127 12.502A8.125 8.125 0 0 1 7.499 1.874 8.128 8.128 0 0 0 10.624 17.5a8.127 8.127 0 0 0 7.502-4.998Z"
        />
      </svg>
    )
  }
)
Moon.displayName = "Moon"
export default Moon
