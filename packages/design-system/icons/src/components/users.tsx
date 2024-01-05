import * as React from "react"
import type { IconProps } from "../types"
const Users = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.5 15.94c.71.206 1.447.31 2.188.31a7.782 7.782 0 0 0 3.434-.793 3.438 3.438 0 0 0-6.278-2.078m.656 2.561v-.002c0-.928-.237-1.8-.655-2.559m.655 2.561v.088A10.265 10.265 0 0 1 7.187 17.5c-1.943 0-3.76-.538-5.312-1.472v-.09a5.312 5.312 0 0 1 9.97-2.559M10 5.313a2.812 2.812 0 1 1-5.625 0 2.812 2.812 0 0 1 5.625 0v0Zm6.875 1.875a2.188 2.188 0 1 1-4.375 0 2.188 2.188 0 0 1 4.375 0v0Z"
        />
      </svg>
    )
  }
)
Users.displayName = "Users"
export default Users
