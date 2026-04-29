import * as React from "react"
import type { IconProps } from "../types"
const BloomBadge = React.forwardRef<SVGSVGElement, IconProps>(
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
        <circle cx={7.5} cy={7.5} r={7.5} fill="#8B5CF6" />
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
          fillRule="evenodd"
          d="M7.5 2.5c.63 0 1.156.564 1.444 1.513.877-.468 1.646-.494 2.092-.048.446.445.418 1.216-.049 2.09.949.289 1.513.814 1.513 1.445 0 .63-.564 1.156-1.513 1.444.467.875.493 1.647.048 2.092s-1.216.419-2.09-.049C8.655 11.936 8.13 12.5 7.5 12.5c-.63 0-1.156-.564-1.444-1.513-.877.467-1.647.493-2.092.048-.446-.446-.418-1.216.049-2.09C3.064 8.655 2.5 8.13 2.5 7.5c0-.63.564-1.156 1.513-1.444-.467-.875-.493-1.647-.048-2.092s1.216-.419 2.09.049C6.345 3.064 6.87 2.5 7.5 2.5m1.563 3.75a.937.937 0 1 0 0 1.875.937.937 0 0 0 0-1.875M6.25 5.625a.937.937 0 1 0 0 1.875.937.937 0 0 0 0-1.875"
          clipRule="evenodd"
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
BloomBadge.displayName = "BloomBadge"
export default BloomBadge
