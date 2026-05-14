import * as React from "react"
import type { IconProps } from "../types"
const Fire = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.838 13.729c-3.218.014-3.202-3.822-1.13-5.947.254 2.973 2.246 1.83 2.928 3.575.508 1.3-.533 2.366-1.797 2.372z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5 13.743c1.664-.013 3.604-.534 4.61-2.153 1.248-2.006.74-4.947-1.428-6.782 0 0-.617 1.31-1.864 1.911 0-4.386-2.825-5.893-2.825-5.893-.189 4.614-2.852 4.762-3.23 8.166-.31 2.81 2.01 4.773 4.737 4.751"
        />
      </svg>
    )
  }
)
Fire.displayName = "Fire"
export default Fire
