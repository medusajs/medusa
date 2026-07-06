import * as React from "react"
import type { IconProps } from "../types"
const Payphone = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path fill="#FF6E00" d="M0 0h20v20H0z" />
        <path fill="url(#a)" fillOpacity={0.2} d="M0 0h20v20H0z" />
        <path
          fill="#fff"
          stroke="#fff"
          strokeLinejoin="round"
          strokeWidth={0.035}
          d="M4.47 10.449c.903.71 2.069 1.099 3.283 1.099a1.25 1.25 0 0 0-.984-1.215 4.16 4.16 0 0 1-1.62-.752c-.577-.455-.931-1.015-1.025-1.614a.146.146 0 0 1 .168-.168c.482.077 1.389.172 3.51.172 1.057.007 1.239.35 1.582 1.21l.024.064c-.3.805-.871 2.474-1.067 3.99.36.049.728.08 1.099.105.105-.802.329-1.666.56-2.405.227.739.459 1.617.563 2.426.371-.007.736-.032 1.103-.067-.189-1.53-.77-3.237-1.075-4.046.018-.042.025-.066.029-.066.339-.854.521-1.197 1.575-1.204 2.159 0 3.062-.095 3.538-.179a.125.125 0 0 1 .143.144c-.087.605-.447 1.18-1.028 1.638a4.1 4.1 0 0 1-1.621.752c-.574.13-.984.627-.984 1.215 1.215 0 2.38-.389 3.284-1.1C16.479 9.704 17 8.707 17 7.646v-.147a1 1 0 0 0-.021-.182c-.105-.48-.62-.766-1.18-.65-.332.066-1.025.206-3.611.206-1.219.007-1.8.427-2.188 1.05-.389-.627-.976-1.043-2.191-1.05-2.583 0-3.276-.14-3.609-.207-.556-.112-1.074.175-1.179.655A.8.8 0 0 0 3 7.502v.147c0 1.06.525 2.054 1.473 2.803z"
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
Payphone.displayName = "Payphone"
export default Payphone
