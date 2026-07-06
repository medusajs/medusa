import * as React from "react"
import type { IconProps } from "../types"
const FeaturedBadge = React.forwardRef<SVGSVGElement, IconProps>(
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
        <circle cx={7.5} cy={7.5} r={7.5} fill="#2563EB" />
        <circle cx={7.5} cy={7.5} r={7.5} fill="url(#a)" fillOpacity={0.2} />
        <circle
          cx={7.5}
          cy={7.5}
          r={7.25}
          stroke={color}
          strokeOpacity={0.24}
          strokeWidth={0.5}
        />
        <g clipPath="url(#b)">
          <path
            fill="#fff"
            d="M11.924 6.27a.42.42 0 0 0-.336-.283L9.02 5.614 7.873 3.288c-.14-.285-.607-.285-.747 0L5.978 5.613l-2.566.373a.417.417 0 0 0-.23.71l1.856 1.81-.439 2.557a.417.417 0 0 0 .605.44l2.295-1.208 2.296 1.207a.41.41 0 0 0 .439-.032.42.42 0 0 0 .165-.407l-.438-2.556 1.857-1.81a.42.42 0 0 0 .105-.428z"
          />
        </g>
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
          <clipPath id="b">
            <path fill="#fff" d="M2.5 2.5h10v10h-10z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
FeaturedBadge.displayName = "FeaturedBadge"
export default FeaturedBadge
