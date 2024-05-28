import * as React from "react"
import type { IconProps } from "../types"
const EllipsisVertical = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M6.306 7.5a1.194 1.194 0 1 1 2.389 0 1.194 1.194 0 0 1-2.39 0M6.306 2.389a1.194 1.194 0 1 1 2.389 0 1.194 1.194 0 0 1-2.39 0M6.306 12.611a1.194 1.194 0 1 1 2.388 0 1.194 1.194 0 0 1-2.388 0"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
EllipsisVertical.displayName = "EllipsisVertical"
export default EllipsisVertical
