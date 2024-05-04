import * as React from "react"
import type { IconProps } from "../types"
const AtSymbol = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.5}
          d="M13.75 10c0 1.38.84 2.5 1.875 2.5 1.036 0 1.875-1.12 1.875-2.5a7.5 7.5 0 1 0-2.197 5.303M13.75 10V6.875m0 3.125a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0v0Z"
        />
      </svg>
    )
  }
)
AtSymbol.displayName = "AtSymbol"
export default AtSymbol
