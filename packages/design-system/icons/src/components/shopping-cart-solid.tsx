import * as React from "react"
import type { IconProps } from "../types"
const ShoppingCartSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M2.08 2.035a.613.613 0 1 0 0 1.225h1.132c.138 0 .26.093.295.227l2.09 7.836a3.065 3.065 0 0 0-2.292 2.966c0 .338.274.613.612.613h12.867a.612.612 0 1 0 0-1.226H4.634a1.838 1.838 0 0 1 1.734-1.225h9.165a.613.613 0 0 0 .55-.344 49.303 49.303 0 0 0 2.419-5.905.611.611 0 0 0-.43-.788A49.723 49.723 0 0 0 4.883 3.88l-.19-.708a1.532 1.532 0 0 0-1.48-1.137H2.079ZM3.304 16.74a1.225 1.225 0 1 1 2.45 0 1.225 1.225 0 0 1-2.45 0Zm10.416 0a1.225 1.225 0 1 1 2.45 0 1.225 1.225 0 0 1-2.45 0Z"
        />
      </svg>
    )
  }
)
ShoppingCartSolid.displayName = "ShoppingCartSolid"
export default ShoppingCartSolid
