import * as React from "react"
import type { IconProps } from "../types"
const CheckCircleMiniSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm3.235-7.934a.75.75 0 0 0-1.248-.832l-2.626 3.939L7.92 9.73a.75.75 0 1 0-1.06 1.06l2.088 2.09a.75.75 0 0 0 1.155-.115l3.133-4.7Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
CheckCircleMiniSolid.displayName = "CheckCircleMiniSolid"
export default CheckCircleMiniSolid
