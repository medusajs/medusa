import * as React from "react"
import type { IconProps } from "../types"
const ShoppingBag = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.625 4.16V2.7a1.875 1.875 0 1 1 3.75 0V4.16"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.445 4.16h6.11c.865 0 1.587.66 1.66 1.522l.544 6.25a1.666 1.666 0 0 1-1.66 1.811H3.901a1.666 1.666 0 0 1-1.66-1.81l.543-6.25A1.667 1.667 0 0 1 4.445 4.16"
        />
      </svg>
    )
  }
)
ShoppingBag.displayName = "ShoppingBag"
export default ShoppingBag
