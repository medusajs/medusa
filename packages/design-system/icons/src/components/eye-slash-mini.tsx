import * as React from "react"
import type { IconProps } from "../types"
const EyeSlashMini = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.654 7.482A6.985 6.985 0 0 0 3.29 10a7.004 7.004 0 0 0 8.619 4.737M6.152 6.152A7.004 7.004 0 0 1 16.71 9.999a7.015 7.015 0 0 1-2.862 3.849M6.152 6.152 4 4m2.152 2.152 2.434 2.433m5.262 5.263L16 16m-2.152-2.152-2.433-2.433a2.002 2.002 0 0 0-.649-3.263 2 2 0 0 0-2.18.434m2.828 2.828L8.587 8.587"
        />
      </svg>
    )
  }
)
EyeSlashMini.displayName = "EyeSlashMini"
export default EyeSlashMini
