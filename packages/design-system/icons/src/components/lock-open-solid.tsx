import * as React from "react"
import type { IconProps } from "../types"
const LockOpenSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.5 1A4.5 4.5 0 0 0 10 5.5V9H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.5V5.5a3 3 0 0 1 6 0v2.75a.75.75 0 1 0 1.5 0V5.5A4.5 4.5 0 0 0 14.5 1Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
LockOpenSolid.displayName = "LockOpenSolid"
export default LockOpenSolid
