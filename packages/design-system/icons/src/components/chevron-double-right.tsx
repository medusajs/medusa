import * as React from "react"
import type { IconProps } from "../types"
const ChevronDoubleRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.167 3.722 11.945 7.5l-3.778 3.778M3.944 3.722 7.722 7.5l-3.778 3.778"
        />
      </svg>
    )
  }
)
ChevronDoubleRight.displayName = "ChevronDoubleRight"
export default ChevronDoubleRight
