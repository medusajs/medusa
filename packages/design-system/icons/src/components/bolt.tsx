import * as React from "react"
import type { IconProps } from "../types"
const Bolt = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m3.125 11.25 8.75-9.375L10 8.75h6.875l-8.75 9.375L10 11.25H3.125Z"
        />
      </svg>
    )
  }
)
Bolt.displayName = "Bolt"
export default Bolt
