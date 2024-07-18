import * as React from "react"
import type { IconProps } from "../types"
const TruckFast = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M3.472 12.938a1.41 1.41 0 1 0 0-2.82 1.41 1.41 0 0 0 0 2.82M9.312 12.938a1.41 1.41 0 1 0 0-2.82 1.41 1.41 0 0 0 0 2.82M7.918 11.326H4.882M4.076 2.465h3.625c.89 0 1.612.721 1.612 1.611v6.042" />
          <path d="M9.313 4.882h1.775c.274 0 .53.14.677.37l1.447 2.25c.084.13.128.281.128.436v1.777a1.61 1.61 0 0 1-1.61 1.611h-1.008M9.313 7.701h3.95M2.465 4.882H5.89M.854 7.299h3.424" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
TruckFast.displayName = "TruckFast"
export default TruckFast
