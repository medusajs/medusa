import * as React from "react"
import type { IconProps } from "../types"
const Eye = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.697 10.268a.843.843 0 0 1 0-.532 8.752 8.752 0 0 1 16.605-.004.831.831 0 0 1 0 .532 8.754 8.754 0 0 1-16.606.004Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
        />
      </svg>
    )
  }
)
Eye.displayName = "Eye"
export default Eye
