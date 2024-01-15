import * as React from "react"
import type { IconProps } from "../types"
const LockClosedSolidMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.889 10a.667.667 0 0 1-.667-.667V6.444A2.225 2.225 0 0 0 10 4.222a2.225 2.225 0 0 0-2.222 2.222v2.89a.667.667 0 0 1-1.334 0v-2.89A3.56 3.56 0 0 1 10 2.89a3.56 3.56 0 0 1 3.556 3.555v2.89a.667.667 0 0 1-.667.666Z"
        />
        <path
          fill={color}
          d="M13.333 8.667H6.667a2.446 2.446 0 0 0-2.445 2.444v3.556a2.446 2.446 0 0 0 2.445 2.444h6.666a2.447 2.447 0 0 0 2.445-2.444V11.11a2.446 2.446 0 0 0-2.445-2.444Zm-2.666 4.666a.667.667 0 0 1-1.334 0v-.889a.667.667 0 0 1 1.334 0v.89Z"
        />
      </svg>
    )
  }
)
LockClosedSolidMini.displayName = "LockClosedSolidMini"
export default LockClosedSolidMini
