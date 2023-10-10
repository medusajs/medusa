import * as React from "react"
import type { IconProps } from "../types"
const BellAlertSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.875 2.917a.625.625 0 0 0-.93-.834 8.1 8.1 0 0 0-1.957 4.064.625.625 0 0 0 1.232.206 6.85 6.85 0 0 1 1.655-3.436Zm11.18-.834a.625.625 0 1 0-.93.834 6.85 6.85 0 0 1 1.655 3.436.625.625 0 0 0 1.233-.206 8.098 8.098 0 0 0-1.957-4.064Z"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M10 1.875A5.625 5.625 0 0 0 4.375 7.5v.625a6.847 6.847 0 0 1-1.766 4.6.625.625 0 0 0 .248 1.005 20.46 20.46 0 0 0 4.026 1.036 3.125 3.125 0 1 0 6.234 0 20.488 20.488 0 0 0 4.025-1.037.625.625 0 0 0 .248-1.004 6.847 6.847 0 0 1-1.765-4.6V7.5A5.625 5.625 0 0 0 10 1.875ZM8.125 15c0-.028 0-.056.002-.083 1.246.112 2.5.112 3.746 0l.002.083a1.875 1.875 0 1 1-3.75 0Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
BellAlertSolid.displayName = "BellAlertSolid"
export default BellAlertSolid
