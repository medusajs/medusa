import * as React from "react"
import type { IconProps } from "../types"
const Pointer = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m2.588 1.974 10.154 3.71a.478.478 0 0 1-.019.906L8.076 8.076 6.59 12.724a.478.478 0 0 1-.905.018L1.974 2.588a.478.478 0 0 1 .614-.614"
        />
      </svg>
    )
  }
)
Pointer.displayName = "Pointer"
export default Pointer
