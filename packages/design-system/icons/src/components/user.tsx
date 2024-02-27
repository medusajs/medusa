import * as React from "react"
import type { IconProps } from "../types"
const User = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.909 5.346a2.909 2.909 0 1 1-5.818 0 2.909 2.909 0 0 1 5.818 0v0Zm-8.726 10.95a5.818 5.818 0 0 1 11.633 0A13.91 13.91 0 0 1 10 17.564c-2.076 0-4.046-.453-5.817-1.266Z"
        />
      </svg>
    )
  }
)
User.displayName = "User"
export default User
