import * as React from "react"
import type { IconProps } from "../types"
const CheckCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 18a8 8 0 1 0 0-16.001A8 8 0 0 0 10 18Zm3.857-9.809a.75.75 0 1 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
CheckCircleSolid.displayName = "CheckCircleSolid"
export default CheckCircleSolid
