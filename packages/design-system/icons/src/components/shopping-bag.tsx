import * as React from "react"
import type { IconProps } from "../types"
const ShoppingBag = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.125 8.75V5a3.125 3.125 0 1 0-6.25 0v3.75m9.463-1.66 1.053 10a.937.937 0 0 1-.933 1.035H3.542a.938.938 0 0 1-.934-1.036l1.054-10a.937.937 0 0 1 .932-.839h10.812c.48 0 .882.362.932.84Zm-9.15 1.66a.312.312 0 1 1-.625 0 .312.312 0 0 1 .625 0Zm6.25 0a.312.312 0 1 1-.625 0 .312.312 0 0 1 .624 0Z"
        />
      </svg>
    )
  }
)
ShoppingBag.displayName = "ShoppingBag"
export default ShoppingBag
