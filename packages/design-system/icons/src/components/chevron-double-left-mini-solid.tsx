import * as React from "react"
import type { IconProps } from "../types"
const ChevronDoubleLeftMiniSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M15.79 14.77a.75.75 0 0 1-1.06.02l-4.5-4.25a.751.751 0 0 1 0-1.08l4.5-4.25a.75.75 0 1 1 1.04 1.08L11.832 10l3.938 3.71a.75.75 0 0 1 .02 1.06Zm-6 0a.75.75 0 0 1-1.06.02l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 1 1 1.04 1.08L5.832 10l3.938 3.71a.75.75 0 0 1 .02 1.06Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ChevronDoubleLeftMiniSolid.displayName = "ChevronDoubleLeftMiniSolid"
export default ChevronDoubleLeftMiniSolid
