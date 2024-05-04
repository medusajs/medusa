import * as React from "react"
import type { IconProps } from "../types"
const ListBullet = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.875 5.625h10M6.875 10h10m-10 4.375h10m-13.75-8.75h.006v.007h-.006v-.007Zm.313 0a.312.312 0 1 1-.625 0 .312.312 0 0 1 .624 0ZM3.124 10h.006v.007h-.006V10Zm.313 0a.313.313 0 1 1-.626 0 .313.313 0 0 1 .626 0Zm-.313 4.375h.006v.007h-.006v-.007Zm.313 0a.313.313 0 1 1-.626 0 .313.313 0 0 1 .626 0Z"
        />
      </svg>
    )
  }
)
ListBullet.displayName = "ListBullet"
export default ListBullet
