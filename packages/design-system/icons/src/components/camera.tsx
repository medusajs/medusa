import * as React from "react"
import type { IconProps } from "../types"
const Camera = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path
            fillRule="evenodd"
            d="M4.582 1.869c.24-.64.85-1.063 1.534-1.063h2.768c.684 0 1.295.424 1.534 1.064l.268.713h1.48a2.527 2.527 0 0 1 2.529 2.528v5.778a2.527 2.527 0 0 1-2.528 2.528H2.833a2.527 2.527 0 0 1-2.527-2.528V5.111a2.527 2.527 0 0 1 2.527-2.528h1.48zm1.534.437a.14.14 0 0 0-.13.09l-.45 1.201a.75.75 0 0 1-.703.486h-2c-.568 0-1.027.46-1.027 1.028v5.778c0 .568.46 1.028 1.027 1.028h9.334c.568 0 1.028-.46 1.028-1.028V5.111c0-.568-.46-1.028-1.028-1.028h-2a.75.75 0 0 1-.702-.486l-.451-1.2a.14.14 0 0 0-.13-.091z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M7.5 6.306a1.694 1.694 0 1 0 0 3.389 1.694 1.694 0 0 0 0-3.39M4.306 8a3.194 3.194 0 1 1 6.389 0 3.194 3.194 0 0 1-6.39 0"
            clipRule="evenodd"
          />
          <path d="M3.278 6.222a.667.667 0 1 0 0-1.333.667.667 0 0 0 0 1.333" />
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
Camera.displayName = "Camera"
export default Camera
