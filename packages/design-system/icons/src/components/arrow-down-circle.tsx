import * as React from "react"
import type { IconProps } from "../types"
const ArrowDownCircle = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M7.5.389C3.58.389.389 3.579.389 7.5s3.19 7.111 7.111 7.111 7.111-3.19 7.111-7.111S11.421.389 7.5.389m2.693 8.249L7.971 10.86a.665.665 0 0 1-.942 0L4.807 8.638a.667.667 0 1 1 .943-.943l1.084 1.084V4.611a.667.667 0 0 1 1.334 0V8.78l1.084-1.084a.667.667 0 1 1 .943.943z"
        />
      </svg>
    )
  }
)
ArrowDownCircle.displayName = "ArrowDownCircle"
export default ArrowDownCircle
