import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpRightOnBox = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.833 1.944h4.223v4.223M13.056 1.944 7.5 7.5M11.278 8.833v2.445c0 .982-.796 1.778-1.778 1.778H3.722a1.777 1.777 0 0 1-1.778-1.778V5.5c0-.982.796-1.778 1.778-1.778h2.445"
        />
      </svg>
    )
  }
)
ArrowUpRightOnBox.displayName = "ArrowUpRightOnBox"
export default ArrowUpRightOnBox
