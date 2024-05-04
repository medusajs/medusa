import * as React from "react"
import type { IconProps } from "../types"
const ClockSolidMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm6-4.25a.75.75 0 0 1 .75.75v3.13l2.441.645a.75.75 0 0 1-.382 1.45l-3-.792a.75.75 0 0 1-.559-.725V6.5a.75.75 0 0 1 .75-.75Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ClockSolidMini.displayName = "ClockSolidMini"
export default ClockSolidMini
