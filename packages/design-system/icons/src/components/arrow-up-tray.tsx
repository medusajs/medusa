import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpTray = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.056 9.944v1.334c0 .982-.796 1.778-1.778 1.778H3.722a1.777 1.777 0 0 1-1.778-1.778V9.944M10.611 5.056 7.5 1.944 4.389 5.056M7.5 1.944v6.667"
        />
      </svg>
    )
  }
)
ArrowUpTray.displayName = "ArrowUpTray"
export default ArrowUpTray
