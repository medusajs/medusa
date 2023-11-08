import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m5 9 5-5m0 0 5 5m-5-5v12"
        />
      </svg>
    )
  }
)
ArrowUpMini.displayName = "ArrowUpMini"
export default ArrowUpMini
