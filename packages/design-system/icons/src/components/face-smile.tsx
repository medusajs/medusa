import * as React from "react"
import type { IconProps } from "../types"
const FaceSmile = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M7.5 13.944a6.444 6.444 0 1 0 0-12.888 6.444 6.444 0 0 0 0 12.888"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.832 9.278a3.78 3.78 0 0 1-3.332 2 3.78 3.78 0 0 1-3.332-2"
          />
          <path d="M6.111 6.611a.389.389 0 1 1-.778 0 .389.389 0 0 1 .778 0ZM9.667 6.611a.389.389 0 1 1-.778 0 .389.389 0 0 1 .778 0Z" />
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
FaceSmile.displayName = "FaceSmile"
export default FaceSmile
