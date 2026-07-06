import * as React from "react"
import type { IconProps } from "../types"
const Resend = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path fill="#0F0F0F" d="M0 0h20v20H0z" />
        <path fill="url(#a)" fillOpacity={0.2} d="M0 0h20v20H0z" />
        <path
          fill="#FDFDFD"
          d="M11.34 4c2.324 0 3.706 1.382 3.706 3.217s-1.382 3.217-3.706 3.217h-1.175L16 16h-4.122l-4.44-4.22c-.319-.294-.466-.636-.466-.93 0-.416.294-.783.857-.942l2.287-.611c.869-.233 1.468-.906 1.468-1.786 0-1.077-.88-1.7-1.97-1.7H4V4z"
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
Resend.displayName = "Resend"
export default Resend
