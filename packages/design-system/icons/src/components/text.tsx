import * as React from "react"
import type { IconProps } from "../types"
const Text = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.783 11.278 4.609 3.722h-.158l-3.173 7.556M2.024 9.5h5.012M9.93 6.82c.432-.466 1.047-.653 1.672-.653 1.048 0 1.897.85 1.897 1.897v3.214" />
          <path d="M11.056 8.611H13.5v.222a2.445 2.445 0 0 1-2.444 2.445 1.334 1.334 0 0 1 0-2.667" />
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
Text.displayName = "Text"
export default Text
