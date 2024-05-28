import * as React from "react"
import type { IconProps } from "../types"
const Key = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="m1.345 13.497.158-2.53L6.739 5.73a3.6 3.6 0 0 1-.128-.897 3.556 3.556 0 1 1 3.556 3.556c-.322 0-.629-.057-.926-.137L7.5 9.944h-2v2l-1.462 1.559z"
          />
          <path d="M10.611 4.778a.389.389 0 1 0 0-.778.389.389 0 0 0 0 .778Z" />
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
Key.displayName = "Key"
export default Key
