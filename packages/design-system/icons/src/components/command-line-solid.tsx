import * as React from "react"
import type { IconProps } from "../types"
const CommandLineSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.278 1.278H3.722a2.446 2.446 0 0 0-2.444 2.444v7.556a2.446 2.446 0 0 0 2.444 2.444h7.556a2.447 2.447 0 0 0 2.444-2.444V3.722a2.446 2.446 0 0 0-2.444-2.444M5.082 10.86a.665.665 0 1 1-.942-.943l1.751-1.751L4.14 6.415a.667.667 0 1 1 .943-.943l2.222 2.222c.26.26.26.683 0 .943l-2.222 2.222zm5.307.196H8.167a.667.667 0 0 1 0-1.334h2.222a.667.667 0 0 1 0 1.334"
        />
      </svg>
    )
  }
)
CommandLineSolid.displayName = "CommandLineSolid"
export default CommandLineSolid
