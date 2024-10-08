import * as React from "react"
import type { IconProps } from "../types"
const RocketLaunch = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.265 8.386c3.118-3.271 2.736-7.084 2.704-7.355C13.697 1 9.885.617 6.614 3.735a10.4 10.4 0 0 0-2.842 4.702l2.79 2.79c.706-.193 2.815-.86 4.703-2.841"
          />
          <path
            fill={color}
            d="M9.743 6.75a1.493 1.493 0 1 0 0-2.985 1.493 1.493 0 0 0 0 2.985"
          />
          <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.5 12.48c-.234.519-.757.88-1.363.88H1.64v-1.496c0-.606.36-1.13.88-1.364M11.211 8.442l.21 1.175a2.8 2.8 0 0 1-1.138 2.779L8.02 14s.548-1.434.238-3.416M6.558 3.789l-1.172-.21a2.8 2.8 0 0 0-2.784 1.14L1 6.98s1.434-.548 3.416-.238"
          />
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
RocketLaunch.displayName = "RocketLaunch"
export default RocketLaunch
