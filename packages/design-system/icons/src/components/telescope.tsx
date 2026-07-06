import * as React from "react"
import type { IconProps } from "../types"
const Telescope = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.49 10.796.79 6.846M10.71 1.201l-1.165.501A.89.89 0 0 0 9.08 2.87l1.988 4.623a.89.89 0 0 0 1.168.466l1.164-.501a.89.89 0 0 0 .466-1.168l-1.988-4.623A.89.89 0 0 0 10.71 1.2M5.503 8.936l-3.3 1.194M10.855 6.999l-2.542.92M1.073 7.5l8.22-4.136M6.29 10.188l-2.123 3.757M7.82 10.188l2.125 3.757M7.056 10.389a1.556 1.556 0 1 0 0-3.111 1.556 1.556 0 0 0 0 3.11"
        />
      </svg>
    )
  }
)
Telescope.displayName = "Telescope"
export default Telescope
