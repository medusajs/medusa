import * as React from "react"
import type { IconProps } from "../types"
const StarSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            fill={color}
            d="M14.578 5.532a.67.67 0 0 0-.538-.453l-4.106-.597L8.097.76c-.224-.455-.971-.455-1.195 0L5.065 4.481.96 5.078a.667.667 0 0 0-.37 1.137L3.562 9.11 2.86 13.2a.667.667 0 0 0 .967.702L7.5 11.973l3.673 1.931a.66.66 0 0 0 .702-.05.67.67 0 0 0 .265-.653l-.702-4.09 2.971-2.895a.67.67 0 0 0 .17-.684z"
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
StarSolid.displayName = "StarSolid"
export default StarSolid
