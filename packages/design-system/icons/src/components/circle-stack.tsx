import * as React from "react"
import type { IconProps } from "../types"
const CircleStack = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeWidth={1.25}
          d="M16.875 5.313c0 1.898-3.078 3.437-6.875 3.437S3.125 7.21 3.125 5.312m13.75 0c0-1.898-3.078-3.437-6.875-3.437s-6.875 1.54-6.875 3.438m13.75 0v9.375c0 1.898-3.078 3.437-6.875 3.437s-6.875-1.54-6.875-3.438V5.313m13.75 0v3.125M3.125 5.312v3.125m13.75 0v3.126C16.875 13.46 13.797 15 10 15s-6.875-1.54-6.875-3.438V8.438m13.75 0c0 1.898-3.078 3.437-6.875 3.437s-6.875-1.54-6.875-3.438"
        />
      </svg>
    )
  }
)
CircleStack.displayName = "CircleStack"
export default CircleStack
