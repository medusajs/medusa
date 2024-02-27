import * as React from "react"
import type { IconProps } from "../types"
const ArrowDownRightMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12 8.667 15.333 12m0 0L12 15.333M15.333 12h-8a2.667 2.667 0 0 1-2.666-2.667V4.667"
        />
      </svg>
    )
  }
)
ArrowDownRightMini.displayName = "ArrowDownRightMini"
export default ArrowDownRightMini
