import * as React from "react"
import type { IconProps } from "../types"
const CurrencyDollar = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 5v10m-2.5-2.348.732.549c.976.732 2.559.732 3.536 0 .976-.733.976-1.92 0-2.652C11.28 10.182 10.64 10 10 10c-.604 0-1.208-.183-1.67-.55-.92-.732-.92-1.918 0-2.65.922-.733 2.418-.733 3.34 0l.345.274M17.5 10a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
        />
      </svg>
    )
  }
)
CurrencyDollar.displayName = "CurrencyDollar"
export default CurrencyDollar
