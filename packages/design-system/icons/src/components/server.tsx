import * as React from "react"
import type { IconProps } from "../types"
const Server = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M18.125 14.375v-.19c0-.289-.034-.577-.1-.858l-1.89-8.034a2.813 2.813 0 0 0-2.738-2.168H6.603a2.813 2.813 0 0 0-2.737 2.168l-1.89 8.034c-.066.281-.1.569-.1.858v.19m16.25 0a2.5 2.5 0 0 1-2.5 2.5H4.375a2.5 2.5 0 0 1-2.5-2.5m16.25 0a2.5 2.5 0 0 0-2.5-2.5H4.375a2.5 2.5 0 0 0-2.5 2.5m13.75 0h.007v.007h-.007v-.007Zm-2.5 0h.007v.007h-.007v-.007Z"
        />
      </svg>
    )
  }
)
Server.displayName = "Server"
export default Server
