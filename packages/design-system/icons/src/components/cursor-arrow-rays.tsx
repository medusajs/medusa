import * as React from "react"
import type { IconProps } from "../types"
const CursorArrowRays = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="m6.696 6.414 6.5 2.23c.198.068.202.346.007.419l-2.915 1.096a.22.22 0 0 0-.13.13l-1.095 2.914a.222.222 0 0 1-.418-.006L6.414 6.696a.223.223 0 0 1 .282-.283zM10.194 10.194l3.744 3.744M6.389 1.056v1.777M10.16 2.617 8.904 3.875M2.617 10.16l1.258-1.257M1.056 6.389h1.777M2.617 2.617l1.258 1.258" />
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
CursorArrowRays.displayName = "CursorArrowRays"
export default CursorArrowRays
