import * as React from "react"
import type { IconProps } from "../types"
const History = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.056 7.5a6.445 6.445 0 1 0 .48-2.444"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m1.171 2.438.363 2.618 2.617-.362M7.5 3.722V7.5l2.889 2"
        />
      </svg>
    )
  }
)
History.displayName = "History"
export default History
