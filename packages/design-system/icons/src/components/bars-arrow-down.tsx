import * as React from "react"
import type { IconProps } from "../types"
const BarsArrowDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m8.611 10.834 2.222 2.222 2.223-2.222M10.833 13.056v-8M1.944 8.166h5.778M1.944 5.056h5.778M1.944 1.944h8.89"
        />
      </svg>
    )
  }
)
BarsArrowDown.displayName = "BarsArrowDown"
export default BarsArrowDown
