import * as React from "react"
import type { IconProps } from "../types"
const SquareDashedCursor = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1.944 5.055V3.722c0-.982.796-1.778 1.778-1.778H5.5M9.5 1.944h1.778c.982 0 1.778.796 1.778 1.778v1.333M5.5 13.055H3.722a1.777 1.777 0 0 1-1.777-1.777V9.944M7.664 7.296l6.092 2.226a.287.287 0 0 1-.01.543l-2.789.892-.892 2.789a.287.287 0 0 1-.543.01L7.296 7.664a.287.287 0 0 1 .368-.368"
        />
      </svg>
    )
  }
)
SquareDashedCursor.displayName = "SquareDashedCursor"
export default SquareDashedCursor
