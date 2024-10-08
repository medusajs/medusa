import * as React from "react"
import type { IconProps } from "../types"
const TopToBottom = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="m9.5 9.722-2 2 2 2M1.056 7.5h4M1.056 11.722h4M1.056 3.278h4" />
          <path d="M7.5 11.722h2.222a4.223 4.223 0 0 0 0-8.444H8.167" />
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
TopToBottom.displayName = "TopToBottom"
export default TopToBottom
