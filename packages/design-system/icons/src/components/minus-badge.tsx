import * as React from "react"
import type { IconProps } from "../types"
const MinusBadge = React.forwardRef<SVGSVGElement, IconProps>(
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
        <circle cx={7.5} cy={7.5} r={7.5} fill="#E11D48" />
        <circle cx={7.5} cy={7.5} r={7.5} fill="url(#a)" fillOpacity={0.2} />
        <circle
          cx={7.5}
          cy={7.5}
          r={7.25}
          stroke={color}
          strokeOpacity={0.24}
          strokeWidth={0.5}
        />
        <path
          fill="#fff"
          d="M10.547 8.25H4.453c-.388 0-.703-.336-.703-.75s.315-.75.703-.75h6.094c.388 0 .703.336.703.75s-.315.75-.703.75"
        />
        <defs>
          <linearGradient
            id="a"
            x1={7.5}
            x2={7.5}
            y1={0}
            y2={15}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
MinusBadge.displayName = "MinusBadge"
export default MinusBadge
