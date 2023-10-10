import * as React from "react"
import type { IconProps } from "../types"
const EyeMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.357 10.215a.675.675 0 0 1 0-.426 7.001 7.001 0 0 1 13.285-.004.665.665 0 0 1 0 .426 7.003 7.003 0 0 1-13.285.003Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
        />
      </svg>
    )
  }
)
EyeMini.displayName = "EyeMini"
export default EyeMini
