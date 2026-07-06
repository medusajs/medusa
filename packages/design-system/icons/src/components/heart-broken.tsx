import * as React from "react"
import type { IconProps } from "../types"
const HeartBroken = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 3.473 5.722 5.722 9.278 7.5 7.5 9.278"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.081 13.03a.9.9 0 0 0 .837 0c1.395-.727 5.803-3.366 5.803-7.655a3.42 3.42 0 0 0-3.4-3.43A3.45 3.45 0 0 0 7.5 3.472a3.45 3.45 0 0 0-2.82-1.529 3.42 3.42 0 0 0-3.401 3.43c0 4.29 4.407 6.929 5.802 7.657"
        />
      </svg>
    )
  }
)
HeartBroken.displayName = "HeartBroken"
export default HeartBroken
