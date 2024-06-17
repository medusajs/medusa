import * as React from "react"
import type { IconProps } from "../types"
const FlagMini = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <g
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            clipPath="url(#b)"
          >
            <path d="M2.833 2.38c1.032-.718 2.006-1.015 2.917-.875 1.502.23 1.995 1.52 3.5 1.75.9.138 1.872-.148 2.917-.874v5.834c-1.045.727-2.016 1.013-2.917.874-1.504-.23-1.998-1.52-3.5-1.75-.912-.14-1.885.157-2.917.875M2.833 1.278v12.444" />
          </g>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
          <clipPath id="b">
            <path fill="#fff" d="M-.5-.5h16v16h-16z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
FlagMini.displayName = "FlagMini"
export default FlagMini
