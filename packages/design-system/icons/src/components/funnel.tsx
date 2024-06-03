import * as React from "react"
import type { IconProps } from "../types"
const Funnel = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m8.833 12.611-2.666 1.333V7.5L1.944 1.944h11.112L8.833 7.5z"
        />
      </svg>
    )
  }
)
Funnel.displayName = "Funnel"
export default Funnel
