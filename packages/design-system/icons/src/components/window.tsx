import * as React from "react"
import type { IconProps } from "../types"
const Window = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
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
            d="M2.833 13.056h9.334c.982 0 1.777-.796 1.777-1.778V3.722c0-.982-.796-1.777-1.777-1.777H2.833c-.981 0-1.777.795-1.777 1.777v7.556c0 .982.796 1.778 1.777 1.778"
          />
          <path
            fill={color}
            d="M3.56 5.19a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M6.062 5.19a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
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
Window.displayName = "Window"
export default Window
