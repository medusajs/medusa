import * as React from "react"
import type { IconProps } from "../types"
const ArrowPathMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.682 8.232h3.328L13.89 6.11a5.5 5.5 0 0 0-9.202 2.467m-.698 6.519v-3.328m0 0h3.328m-3.328 0 2.12 2.122a5.5 5.5 0 0 0 9.202-2.467m.698-6.519v3.327"
        />
      </svg>
    )
  }
)
ArrowPathMini.displayName = "ArrowPathMini"
export default ArrowPathMini
