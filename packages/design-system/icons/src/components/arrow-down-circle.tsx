import * as React from "react"
import type { IconProps } from "../types"
const ArrowDownCircle = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m7.5 10.625 2.5 2.5m0 0 2.5-2.5m-2.5 2.5v-6.25M17.5 10a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
        />
      </svg>
    )
  }
)
ArrowDownCircle.displayName = "ArrowDownCircle"
export default ArrowDownCircle
me = "ArrowDownCircle"
export default ArrowDownCircle
