import * as React from "react"
import type { IconProps } from "../types"
const XMarkMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m6 14 8-8M6 6l8 8"
        />
      </svg>
    )
  }
)
XMarkMini.displayName = "XMarkMini"
export default XMarkMini
