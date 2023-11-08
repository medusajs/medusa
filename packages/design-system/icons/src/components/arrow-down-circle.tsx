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
          fill={color}
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16.001A8 8 0 0 0 10 18Zm.75-11.25a.75.75 0 1 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.752.752 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ArrowDownCircle.displayName = "ArrowDownCircle"
export default ArrowDownCircle
