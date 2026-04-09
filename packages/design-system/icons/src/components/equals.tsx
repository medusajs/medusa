import * as React from "react"
import type { IconProps } from "../types"
const Equals = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.944 5.5h11.112M1.944 9.5h11.112"
        />
      </svg>
    )
  }
)
Equals.displayName = "Equals"
export default Equals
