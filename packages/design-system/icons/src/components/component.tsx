import * as React from "react"
import type { IconProps } from "../types"
const Component = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M3.275 5.225 5.55 7.5 3.275 9.775 1 7.5zM7.5 1l2.275 2.275L7.5 5.55 5.225 3.275zM11.725 5.225 14 7.5l-2.275 2.275L9.45 7.5zM7.5 9.45l2.275 2.275L7.5 14l-2.275-2.275z" />
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
Component.displayName = "Component"
export default Component
