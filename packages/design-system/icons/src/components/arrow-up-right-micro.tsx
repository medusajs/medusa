import * as React from "react"
import type { IconProps } from "../types"
const ArrowUpRightMicro = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m12.167 2.833-9.334 9.334M6.824 2.833h5.343v5.342"
        />
      </svg>
    )
  }
)
ArrowUpRightMicro.displayName = "ArrowUpRightMicro"
export default ArrowUpRightMicro
