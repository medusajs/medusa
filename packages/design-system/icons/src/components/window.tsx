import * as React from "react"
import type { IconProps } from "../types"
const Window = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M3.125 4.166a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25M5.209 4.166a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25" />
          <path
            fillRule="evenodd"
            d="M2.709.708A2.417 2.417 0 0 0 .292 3.125v7.083a2.417 2.417 0 0 0 2.417 2.417h4.885a.75.75 0 0 0 0-1.5H2.709a.917.917 0 0 1-.917-.917V6.375h10.583V7.48a.75.75 0 0 0 1.5 0V3.125A2.417 2.417 0 0 0 11.46.708zm9.666 4.167H1.792v-1.75c0-.506.41-.917.917-.917h8.75c.506 0 .916.41.916.917z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M9.11 7.434c-.78-.282-1.548.473-1.258 1.263l1.808 4.949c.32.88 1.575.854 1.86-.039l.607-1.897 1.898-.607c.891-.285.916-1.539.037-1.86l-4.95-1.808zm1.44 4.28-.908-2.488 2.488.908-.828.265a.75.75 0 0 0-.486.486z"
            clipRule="evenodd"
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
