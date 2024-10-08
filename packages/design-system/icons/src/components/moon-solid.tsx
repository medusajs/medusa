import * as React from "react"
import type { IconProps } from "../types"
const MoonSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M14.349 8.587a.665.665 0 0 0-.745-.033 4.9 4.9 0 0 1-2.548.723 4.894 4.894 0 0 1-4.89-4.889c0-1.019.315-1.997.91-2.832A.667.667 0 0 0 6.41.513 7.11 7.11 0 0 0 .611 7.5c0 3.92 3.19 7.111 7.111 7.111a7.11 7.11 0 0 0 6.876-5.32.67.67 0 0 0-.25-.704"
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
MoonSolid.displayName = "MoonSolid"
export default MoonSolid
