import * as React from "react"
import type { IconProps } from "../types"
const SidebarRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.5 6v8m3-7.125V15a1.875 1.875 0 0 1-1.875 1.875H4.375A1.875 1.875 0 0 1 2.5 15V5a1.875 1.875 0 0 1 1.875-1.875h11.25A1.875 1.875 0 0 1 17.5 5v1.875Z"
        />
      </svg>
    )
  }
)
SidebarRight.displayName = "SidebarRight"
export default SidebarRight
