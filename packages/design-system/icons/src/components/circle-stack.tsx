import * as React from "react"
import type { IconProps } from "../types"
const CircleStack = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 5.278c3.068 0 5.556-.896 5.556-2s-2.488-2-5.556-2-5.556.895-5.556 2 2.488 2 5.556 2"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1.944 3.278v8.444c0 1.105 2.488 2 5.556 2s5.556-.895 5.556-2V3.278"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1.944 7.5c0 1.105 2.488 2 5.556 2s5.556-.895 5.556-2"
        />
      </svg>
    )
  }
)
CircleStack.displayName = "CircleStack"
export default CircleStack
