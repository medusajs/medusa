import * as React from "react"
import type { IconProps } from "../types"
const PencilSquareSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M6.833 2.611H1.056a.667.667 0 0 1 0-1.333h5.777a.667.667 0 0 1 0 1.333M3.278 5.722H1.056a.667.667 0 0 1 0-1.333h2.222a.667.667 0 0 1 0 1.333M10.535 2.032 3.593 8.973c-.767.768-1.245 3.028-1.416 3.964a.668.668 0 0 0 .775.776c.936-.17 3.196-.648 3.964-1.416l6.941-6.942a2.353 2.353 0 0 0 0-3.322c-.887-.888-2.434-.888-3.322-.001" />
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
PencilSquareSolid.displayName = "PencilSquareSolid"
export default PencilSquareSolid
