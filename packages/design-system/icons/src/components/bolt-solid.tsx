import * as React from "react"
import type { IconProps } from "../types"
const BoltSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill={color}
          d="M12.716 5.003a1.11 1.11 0 0 0-.994-.614H9.364l.967-2.487A1.113 1.113 0 0 0 9.296.389H5.589c-.464 0-.884.292-1.044.728l-2.12 5.779A1.112 1.112 0 0 0 3.47 8.388h3.369l-1.535 5.373a.666.666 0 0 0 1.174.583l6.135-8.177c.253-.339.293-.784.104-1.164"
        />
      </svg>
    )
  }
)
BoltSolid.displayName = "BoltSolid"
export default BoltSolid
