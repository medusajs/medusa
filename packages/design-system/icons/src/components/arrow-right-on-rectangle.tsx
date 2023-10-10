import * as React from "react"
import type { IconProps } from "../types"
const ArrowRightOnRectangle = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.125 7.5V4.375A1.875 1.875 0 0 0 11.25 2.5h-5a1.875 1.875 0 0 0-1.875 1.875v11.25A1.875 1.875 0 0 0 6.25 17.5h5a1.875 1.875 0 0 0 1.875-1.875V12.5m2.5 0 2.5-2.5m0 0-2.5-2.5m2.5 2.5H7.5"
        />
      </svg>
    )
  }
)
ArrowRightOnRectangle.displayName = "ArrowRightOnRectangle"
export default ArrowRightOnRectangle
