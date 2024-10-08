import * as React from "react"
import type { IconProps } from "../types"
const CloudArrowDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M10.167 10h.444c1.841 0 3.333-1.314 3.333-2.935 0-1.358-1.053-2.49-2.476-2.824C11.303 2.43 9.6 1 7.5 1c-2.209 0-4 1.577-4 3.522 0 .274.044.537.11.793-1.42.052-2.554 1.075-2.554 2.337C1.056 8.95 2.249 10 3.722 10h1.111M9.5 12.11l-2 2-2-2M7.5 14.11V6.554" />
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
CloudArrowDown.displayName = "CloudArrowDown"
export default CloudArrowDown
