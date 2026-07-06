import * as React from "react"
import type { IconProps } from "../types"
const StoreCredits = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        ref={ref}
        {...props}
      >
        <path fill="#8B5CF6" d="M0 0h20v20H0z" />
        <path fill="url(#a)" fillOpacity={0.2} d="M0 0h20v20H0z" />
        <path
          fill="#fff"
          d="M16 8v-.25A2.75 2.75 0 0 0 13.25 5h-6.5A2.75 2.75 0 0 0 4 7.75V8zM4 9.5v2.75A2.75 2.75 0 0 0 6.75 15h6.5A2.75 2.75 0 0 0 16 12.25V9.5zm9.25 3.5h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 0 1.5"
        />
        <defs>
          <linearGradient
            id="a"
            x1={10}
            x2={10}
            y1={0}
            y2={20}
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
StoreCredits.displayName = "StoreCredits"
export default StoreCredits
