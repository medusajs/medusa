import * as React from "react"
import type { IconProps } from "../types"
const TablePen = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.5 1.944v11.111M13.056 5.5H1.944M13.056 6.238V3.722a1.78 1.78 0 0 0-1.778-1.778H3.722c-.982 0-1.778.8-1.778 1.778v7.556a1.78 1.78 0 0 0 1.778 1.777h2.525M11.085 13.448l2.81-2.81a.89.89 0 0 0 0-1.257l-.52-.52a.89.89 0 0 0-1.258 0l-2.81 2.81-.707 2.485z"
        />
      </svg>
    )
  }
)
TablePen.displayName = "TablePen"
export default TablePen
