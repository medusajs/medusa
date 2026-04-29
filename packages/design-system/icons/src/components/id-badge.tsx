import * as React from "react"
import type { IconProps } from "../types"
const IdBadge = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M5.072 8.011a1.128 1.128 0 1 0 0-2.256 1.128 1.128 0 0 0 0 2.256M6.886 10.587a.576.576 0 0 0 .36-.779 2.377 2.377 0 0 0-4.347 0 .576.576 0 0 0 .36.779 6.014 6.014 0 0 0 3.627 0"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.055 3.533h1.111c.983 0 1.778.796 1.778 1.778v5.778c0 .982-.795 1.777-1.778 1.777H2.833a1.777 1.777 0 0 1-1.778-1.777V5.31c0-.982.796-1.778 1.778-1.778h1.111"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5.867c.613 0 1.11.497 1.11 1.11v2H6.39v-2c0-.613.497-1.11 1.11-1.11M8.833 7.089h2.445M8.833 9.755h2.445"
        />
      </svg>
    )
  }
)
IdBadge.displayName = "IdBadge"
export default IdBadge
