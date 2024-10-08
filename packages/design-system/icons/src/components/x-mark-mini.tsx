import * as React from "react"
import type { IconProps } from "../types"
const XMarkMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m11.25 3.75-7.5 7.5M3.75 3.75l7.5 7.5"
        />
      </svg>
    )
  }
)
XMarkMini.displayName = "XMarkMini"
export default XMarkMini
