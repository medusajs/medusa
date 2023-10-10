import * as React from "react"
import type { IconProps } from "../types"
const GiftSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14 6a2.5 2.5 0 1 0-4-3 2.5 2.5 0 1 0-4 3H3.25C2.56 6 2 6.56 2 7.25v.5C2 8.44 2.56 9 3.25 9h6V6h1.5v3h6C17.44 9 18 8.44 18 7.75v-.5C18 6.56 17.44 6 16.75 6H14Zm-1-1.5a1 1 0 0 1-1 1h-1v-1a1 1 0 0 1 2 0Zm-6 0a1 1 0 0 0 1 1h1v-1a1 1 0 0 0-2 0Z"
          clipRule="evenodd"
        />
        <path
          fill={color}
          d="M9.25 10.5H3v4.75A2.75 2.75 0 0 0 5.75 18h3.5v-7.5Zm1.5 7.5v-7.5H17v4.75A2.75 2.75 0 0 1 14.25 18h-3.5Z"
        />
      </svg>
    )
  }
)
GiftSolid.displayName = "GiftSolid"
export default GiftSolid
