import * as React from "react"
import type { IconProps } from "../types"
const SidebarRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M2.833 13.25h9.334c.982 0 1.777-.824 1.777-1.84V3.59c0-1.016-.796-1.84-1.777-1.84H2.833c-.981 0-1.777.824-1.777 1.84v7.82c0 1.016.796 1.84 1.777 1.84M11.1 4.5v6" />
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
SidebarRight.displayName = "SidebarRight"
export default SidebarRight
