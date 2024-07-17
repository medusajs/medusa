import * as React from "react"
import type { IconProps } from "../types"
const Bookmarks = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m10.389 13.944-4.222-3.11-4.223 3.11V5.5c0-.982.796-1.778 1.778-1.778h4.89c.981 0 1.777.796 1.777 1.778z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.528 1.278c.255-.141.548-.222.86-.222h4.89c.982 0 1.778.795 1.778 1.777v8.445"
        />
      </svg>
    )
  }
)
Bookmarks.displayName = "Bookmarks"
export default Bookmarks
