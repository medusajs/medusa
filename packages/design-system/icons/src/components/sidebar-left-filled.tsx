import * as React from "react"
import type { IconProps } from "../types"
const SidebarLeftFilled = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12.167 1.75H2.833c-.981 0-1.777.824-1.777 1.84v7.82c0 1.016.796 1.84 1.777 1.84h9.334c.982 0 1.778-.824 1.778-1.84V3.59c0-1.016-.796-1.84-1.778-1.84"
          />
          <rect
            width={4.5}
            height={7.5}
            x={3.15}
            y={3.75}
            fill={color}
            rx={0.5}
          />
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
SidebarLeftFilled.displayName = "SidebarLeftFilled"
export default SidebarLeftFilled
