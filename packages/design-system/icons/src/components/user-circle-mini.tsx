import * as React from "react"
import type { IconProps } from "../types"
const UserCircleMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.5 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM5 15.412a5 5 0 0 1 10 0 11.956 11.956 0 0 1-5 1.088c-1.784 0-3.477-.39-5-1.088Z"
        />
      </svg>
    )
  }
)
UserCircleMini.displayName = "UserCircleMini"
export default UserCircleMini
