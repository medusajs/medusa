import * as React from "react"
import type { IconProps } from "../types"
const ChartBar = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 10.938c0-.518.42-.938.938-.938h1.874c.518 0 .938.42.938.938v5.624c0 .518-.42.938-.938.938H3.438a.938.938 0 0 1-.937-.938v-5.625Zm5.625-3.75c0-.518.42-.938.938-.938h1.874c.518 0 .938.42.938.938v9.375c0 .517-.42.937-.938.937H9.063a.938.938 0 0 1-.938-.938V7.188Zm5.625-3.75c0-.518.42-.938.938-.938h1.874c.518 0 .938.42.938.938v13.124c0 .518-.42.938-.938.938h-1.875a.938.938 0 0 1-.937-.938V3.438Z"
        />
      </svg>
    )
  }
)
ChartBar.displayName = "ChartBar"
export default ChartBar
