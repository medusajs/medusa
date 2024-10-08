import * as React from "react"
import type { IconProps } from "../types"
const Eye = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M7.5 12.833c-3.558 0-5.725-2.48-6.7-3.96a2.49 2.49 0 0 1 0-2.747c.975-1.48 3.142-3.96 6.7-3.96s5.725 2.48 6.7 3.96a2.49 2.49 0 0 1 0 2.746c-.975 1.48-3.142 3.961-6.7 3.961m0-9.333c-2.934 0-4.76 2.106-5.588 3.36a1.18 1.18 0 0 0 0 1.28C2.74 9.393 4.566 11.5 7.5 11.5s4.76-2.106 5.588-3.36a1.18 1.18 0 0 0 0-1.28C12.26 5.607 10.434 3.5 7.5 3.5" />
          <path d="M7.5 10.389a2.889 2.889 0 1 0 0-5.778 2.889 2.889 0 0 0 0 5.778" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
Eye.displayName = "Eye"
export default Eye
