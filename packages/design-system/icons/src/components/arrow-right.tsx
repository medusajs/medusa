import * as React from "react"
import type { IconProps } from "../types"
const ArrowRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.056 7.5H1.944M9.278 3.722 13.056 7.5l-3.778 3.778"
        />
      </svg>
    )
  }
)
ArrowRight.displayName = "ArrowRight"
export default ArrowRight
