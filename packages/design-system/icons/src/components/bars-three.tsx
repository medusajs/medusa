import * as React from "react"
import type { IconProps } from "../types"
const BarsThree = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1.5 7.5h12M1.5 2.833h12M1.5 12.167h12"
        />
      </svg>
    )
  }
)
BarsThree.displayName = "BarsThree"
export default BarsThree
