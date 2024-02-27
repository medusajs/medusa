import * as React from "react"
import type { IconProps } from "../types"
const PlaySolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M3.75 4.71a1.563 1.563 0 0 1 2.316-1.368l9.616 5.29c1.08.593 1.08 2.144 0 2.737l-9.615 5.29A1.563 1.563 0 0 1 3.75 15.29V4.71H3.75Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
PlaySolid.displayName = "PlaySolid"
export default PlaySolid
