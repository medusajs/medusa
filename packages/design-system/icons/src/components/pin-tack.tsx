import * as React from "react"
import type { IconProps } from "../types"
const PinTack = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m2.239 12.761 2.958-2.958M8.719 13.325a6.654 6.654 0 0 0 1.414-3.928l2.671-2.671a1.777 1.777 0 0 0 0-2.514l-2.016-2.016a1.777 1.777 0 0 0-2.514 0l-2.67 2.671a6.7 6.7 0 0 0-1.513.216 6.75 6.75 0 0 0-2.416 1.198z"
        />
      </svg>
    )
  }
)
PinTack.displayName = "PinTack"
export default PinTack
