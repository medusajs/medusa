import * as React from "react"
import type { IconProps } from "../types"
const AtSymbol = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.389 10.167c1.411 0 2.555-1.244 2.555-2.778S8.8 4.61 7.39 4.61 4.833 5.855 4.833 7.39s1.144 2.778 2.556 2.778" />
          <path d="M9.944 4.611v4.607c0 1.382 2.077 1.62 3.175-.248.932-1.58.704-3.99-.46-5.577C10.947 1.058 6.99.185 4.114 2.115 1.472 3.89.531 7.478 1.991 10.378c1.444 2.87 4.835 4.262 7.905 3.223" />
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
AtSymbol.displayName = "AtSymbol"
export default AtSymbol
