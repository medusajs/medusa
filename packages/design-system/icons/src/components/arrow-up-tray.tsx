import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpTray = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.056 9.944v1.334c0 .982-.796 1.777-1.778 1.777H3.722a1.777 1.777 0 0 1-1.778-1.777V9.944M10.611 5.055 7.5 1.945l-3.111 3.11M7.5 1.944v6.667"
        />
      </svg>
    )
  }
)
ArrowUpTray.displayName = "ArrowUpTray"
export default ArrowUpTray
