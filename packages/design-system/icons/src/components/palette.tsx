import * as React from "react"
import type { IconProps } from "../types"
const Palette = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.38 14.415a6.445 6.445 0 0 1-5.819-6.69c.14-3.348 2.978-6.112 6.328-6.168A6.444 6.444 0 0 1 14.444 8 2.444 2.444 0 0 1 12 10.444H9.366c-.919 0-1.505.981-1.069 1.79l.211.392c.231.43.183.954-.12 1.335-.244.304-.62.491-1.007.454"
        />
        <path
          fill={color}
          d="M8 5.333a.889.889 0 1 0 0-1.777.889.889 0 0 0 0 1.777M5.486 6.374a.889.889 0 1 0 0-1.777.889.889 0 0 0 0 1.777M10.514 6.374a.889.889 0 1 0 0-1.777.889.889 0 0 0 0 1.777M4.444 8.89a.889.889 0 1 0 0-1.779.889.889 0 0 0 0 1.778"
        />
      </svg>
    )
  }
)
Palette.displayName = "Palette"
export default Palette
