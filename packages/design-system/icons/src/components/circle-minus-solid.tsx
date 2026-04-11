import * as React from "react"
import type { IconProps } from "../types"
const CircleMinusSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M7.5.389C3.58.389.389 3.579.389 7.5s3.19 7.111 7.111 7.111 7.111-3.19 7.111-7.111S11.421.389 7.5.389m2.889 7.778H4.61a.667.667 0 0 1 0-1.334h5.778a.667.667 0 0 1 0 1.334"
        />
      </svg>
    )
  }
)
CircleMinusSolid.displayName = "CircleMinusSolid"
export default CircleMinusSolid
