import * as React from "react"
import type { IconProps } from "../types"
const CheckMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m5.833 10.417 3.334 3.333 5-7.5"
        />
      </svg>
    )
  }
)
CheckMini.displayName = "CheckMini"
export default CheckMini
