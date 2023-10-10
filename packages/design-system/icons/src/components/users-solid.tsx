import * as React from "react"
import type { IconProps } from "../types"
const UsersSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M4.018 5.513a3.29 3.29 0 1 1 6.58 0 3.29 3.29 0 0 1-6.58 0Zm7.776 1.795a2.692 2.692 0 1 1 5.384 0 2.692 2.692 0 0 1-5.384 0ZM1.625 15.683a5.683 5.683 0 0 1 11.366 0v.097a.598.598 0 0 1-.29.503 10.423 10.423 0 0 1-5.393 1.494c-1.972 0-3.817-.546-5.392-1.494a.598.598 0 0 1-.29-.503l-.001-.097Zm12.562.002v.115a1.794 1.794 0 0 1-.186.766 8.047 8.047 0 0 0 4.036-.806.6.6 0 0 0 .335-.513 3.89 3.89 0 0 0-5.55-3.677 6.848 6.848 0 0 1 1.365 4.113v.002Z"
        />
      </svg>
    )
  }
)
UsersSolid.displayName = "UsersSolid"
export default UsersSolid
