import * as React from "react"
import type { IconProps } from "../types"
const Resize = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m16.754 12.437-4.313 4.313M16.75 7.75l-9 9"
        />
      </svg>
    )
  }
)
Resize.displayName = "Resize"
export default Resize
