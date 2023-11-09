import * as React from "react"
import type { IconProps } from "../types"
const ChevronRightMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m8 6 4 4-4 4"
        />
      </svg>
    )
  }
)
ChevronRightMini.displayName = "ChevronRightMini"
export default ChevronRightMini
