import * as React from "react"
import type { IconProps } from "../types"
const ExclamationCircle = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g stroke={color} clipPath="url(#a)">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7.5 13.944a6.444 6.444 0 1 0 0-12.888 6.444 6.444 0 0 0 0 12.888M7.5 4.328v3.678"
          />
          <path
            strokeWidth={0.9}
            d="M7.5 10.976a.44.44 0 0 1 0-.878.44.44 0 0 1 0 .878Z"
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
ExclamationCircle.displayName = "ExclamationCircle"
export default ExclamationCircle
