import * as React from "react"
import type { IconProps } from "../types"
const ListBullet = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.833 9.5H13.5M6.833 12.611H13.5M6.833 3.278H13.5M6.833 6.389H13.5M2.833 4.611a1.333 1.333 0 1 0 0-2.667 1.333 1.333 0 0 0 0 2.667M2.833 10.833a1.333 1.333 0 1 0 0-2.666 1.333 1.333 0 0 0 0 2.666"
        />
      </svg>
    )
  }
)
ListBullet.displayName = "ListBullet"
export default ListBullet
