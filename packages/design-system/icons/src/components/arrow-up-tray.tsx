import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpTray = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 13.75v1.875A1.875 1.875 0 0 0 4.375 17.5h11.25a1.875 1.875 0 0 0 1.875-1.875V13.75M6.25 6.25 10 2.5m0 0 3.75 3.75M10 2.5v11.25"
        />
      </svg>
    )
  }
)
ArrowUpTray.displayName = "ArrowUpTray"
export default ArrowUpTray
