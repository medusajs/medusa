import * as React from "react"
import type { IconProps } from "../types"
const Brackets = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M5.056 13.055h-.89a1.777 1.777 0 0 1-1.777-1.777V8.944c0-.797-.647-1.444-1.445-1.444.798 0 1.445-.647 1.445-1.445V3.722c0-.982.795-1.778 1.778-1.778h.889M9.944 13.055h.89c.982 0 1.777-.795 1.777-1.777V8.944c0-.797.647-1.444 1.445-1.444a1.445 1.445 0 0 1-1.445-1.445V3.722c0-.982-.795-1.778-1.778-1.778h-.889" />
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
Brackets.displayName = "Brackets"
export default Brackets
