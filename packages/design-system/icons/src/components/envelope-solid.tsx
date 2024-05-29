import * as React from "react"
import type { IconProps } from "../types"
const EnvelopeSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.393 7.346a.22.22 0 0 0 .214 0l6.912-3.807a2.44 2.44 0 0 0-2.352-1.817H2.833A2.44 2.44 0 0 0 .483 3.53z" />
          <path d="M8.251 8.513a1.55 1.55 0 0 1-1.502 0L.389 5v5.833a2.446 2.446 0 0 0 2.444 2.445h9.334a2.446 2.446 0 0 0 2.444-2.445V5.011z" />
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
EnvelopeSolid.displayName = "EnvelopeSolid"
export default EnvelopeSolid
