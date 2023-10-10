import * as React from "react"
import type { IconProps } from "../types"
const ArrowsPointingOutMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.5 15.5v-3m0 3h3m-3 0L8 12m7.5-7.5h-3m3 0v3m0-3L12 8"
        />
      </svg>
    )
  }
)
ArrowsPointingOutMini.displayName = "ArrowsPointingOutMini"
export default ArrowsPointingOutMini
