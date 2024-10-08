import * as React from "react"
import type { IconProps } from "../types"
const Bolt = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m5.944 13.945 1.778-6.223H3.47a.444.444 0 0 1-.417-.597L5.17 1.347a.44.44 0 0 1 .417-.291h3.707c.313 0 .527.313.414.605l-1.32 3.395h3.333c.366 0 .575.417.356.71z"
        />
      </svg>
    )
  }
)
Bolt.displayName = "Bolt"
export default Bolt
