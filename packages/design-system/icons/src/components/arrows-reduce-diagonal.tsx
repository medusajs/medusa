import * as React from "react"
import type { IconProps } from "../types"
const ArrowsReduceDiagonal = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.056 5.944h-4v-4M9.056 5.944l4-4M5.944 13.056v-4h-4M5.944 9.056l-4 4"
        />
      </svg>
    )
  }
)
ArrowsReduceDiagonal.displayName = "ArrowsReduceDiagonal"
export default ArrowsReduceDiagonal
