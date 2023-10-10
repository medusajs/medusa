import * as React from "react"
import type { IconProps } from "../types"
const PencilSquare = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m14.052 3.74 1.405-1.408a1.563 1.563 0 0 1 2.21 2.21l-8.849 8.85a3.75 3.75 0 0 1-1.58.941L5 15l.667-2.238a3.75 3.75 0 0 1 .941-1.58l7.444-7.443Zm0 0 2.198 2.197M15 11.667v3.958a1.875 1.875 0 0 1-1.875 1.875h-8.75A1.875 1.875 0 0 1 2.5 15.625v-8.75A1.875 1.875 0 0 1 4.375 5h3.958"
        />
      </svg>
    )
  }
)
PencilSquare.displayName = "PencilSquare"
export default PencilSquare
