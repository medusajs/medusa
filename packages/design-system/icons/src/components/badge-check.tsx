import * as React from "react"
import type { IconProps } from "../types"
const BadgeCheck = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M14.611 7.5a2.9 2.9 0 0 0-1.302-2.406 2.9 2.9 0 0 0-.78-2.622 2.9 2.9 0 0 0-2.623-.78A2.9 2.9 0 0 0 7.5.388 2.9 2.9 0 0 0 5.094 1.69a2.89 2.89 0 0 0-2.622.78 2.9 2.9 0 0 0-.78 2.623A2.9 2.9 0 0 0 .388 7.5 2.9 2.9 0 0 0 1.69 9.906a2.9 2.9 0 0 0 .78 2.622 2.9 2.9 0 0 0 2.623.78A2.9 2.9 0 0 0 7.5 14.612a2.9 2.9 0 0 0 2.406-1.302 2.9 2.9 0 0 0 2.622-.78c.69-.69.972-1.686.78-2.623A2.9 2.9 0 0 0 14.612 7.5m-3.695-2.037-3.778 4.889a.67.67 0 0 1-.502.258h-.025a.67.67 0 0 1-.496-.22l-2-2.222a.668.668 0 0 1 .992-.893l1.465 1.629 3.29-4.257a.667.667 0 0 1 1.055.815z"
        />
      </svg>
    )
  }
)
BadgeCheck.displayName = "BadgeCheck"
export default BadgeCheck
