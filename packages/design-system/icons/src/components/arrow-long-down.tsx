import * as React from "react"
import type { IconProps } from "../types"
const ArrowLongDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 13.055V1.945M11.278 9.278 7.5 13.056 3.722 9.278"
        />
      </svg>
    )
  }
)
ArrowLongDown.displayName = "ArrowLongDown"
export default ArrowLongDown
