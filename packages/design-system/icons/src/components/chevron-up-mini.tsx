import * as React from "react"
import type { IconProps } from "../types"
const ChevronUpMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m15 12-5-5-5 5"
        />
      </svg>
    )
  }
)
ChevronUpMini.displayName = "ChevronUpMini"
export default ChevronUpMini
