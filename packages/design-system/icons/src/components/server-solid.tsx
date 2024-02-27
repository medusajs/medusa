import * as React from "react"
import type { IconProps } from "../types"
const ServerSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.4 4.356A2.5 2.5 0 0 1 5.816 2.5h8.367A2.5 2.5 0 0 1 16.6 4.356l1.76 6.605A4.357 4.357 0 0 0 15.626 10H4.375a4.357 4.357 0 0 0-2.737.96L3.4 4.357Z"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M4.375 11.25a3.124 3.124 0 1 0 0 6.25h11.25a3.124 3.124 0 1 0 0-6.25H4.375Zm8.75 3.75a.624.624 0 1 0 0-1.249.624.624 0 0 0 0 1.249Zm3.125-.625a.624.624 0 1 1-1.249 0 .624.624 0 0 1 1.249 0Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ServerSolid.displayName = "ServerSolid"
export default ServerSolid
