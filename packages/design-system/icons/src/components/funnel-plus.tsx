import * as React from "react"
import type { IconProps } from "../types"
const FunnelPlus = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.278 7.722v4.445M8.833 7.5l4.223-5.556H1.944L6.167 7.5v6.444l2.666-1.333v-.467M13.5 9.944H9.056"
        />
      </svg>
    )
  }
)
FunnelPlus.displayName = "FunnelPlus"
export default FunnelPlus
