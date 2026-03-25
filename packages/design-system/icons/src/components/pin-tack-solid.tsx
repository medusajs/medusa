import * as React from "react"
import type { IconProps } from "../types"
const PinTackSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill={color}
          d="M7.743 1.666a2.53 2.53 0 0 1 3.576 0l2.015 2.015a2.53 2.53 0 0 1 0 3.575l-2.467 2.467a7.4 7.4 0 0 1-.225 1.377 7.5 7.5 0 0 1-1.295 2.635.75.75 0 0 1-1.157.121l-2.993-2.992-2.428 2.428a.75.75 0 0 1-1.06-1.06l2.427-2.429-2.991-2.99a.75.75 0 0 1 .07-1.124A7.5 7.5 0 0 1 3.9 4.358l.236-.058a7.4 7.4 0 0 1 1.139-.167z"
        />
      </svg>
    )
  }
)
PinTackSolid.displayName = "PinTackSolid"
export default PinTackSolid
