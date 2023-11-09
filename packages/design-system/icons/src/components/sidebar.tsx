import * as React from "react"
import type { IconProps } from "../types"
const Sidebar = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9 3.125H4.375A1.875 1.875 0 0 0 2.5 5v10a1.875 1.875 0 0 0 1.875 1.875H9m0-13.75h6.625A1.875 1.875 0 0 1 17.5 5v10a1.875 1.875 0 0 1-1.875 1.875H9m0-13.75v13.75M5 6.5h1.5M5 9.5h1.5"
        />
      </svg>
    )
  }
)
Sidebar.displayName = "Sidebar"
export default Sidebar
