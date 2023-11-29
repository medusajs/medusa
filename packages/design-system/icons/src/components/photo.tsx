import * as React from "react"
import type { IconProps } from "../types"
const Photo = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m1.875 13.125 4.3-4.3a1.875 1.875 0 0 1 2.65 0l4.3 4.3m-1.25-1.25 1.174-1.174a1.874 1.874 0 0 1 2.652 0l2.424 2.424m-15 3.125h13.75a1.25 1.25 0 0 0 1.25-1.25V5a1.25 1.25 0 0 0-1.25-1.25H3.125A1.25 1.25 0 0 0 1.875 5v10a1.25 1.25 0 0 0 1.25 1.25Zm8.75-9.375h.007v.007h-.007v-.007Zm.313 0a.312.312 0 1 1-.625 0 .312.312 0 0 1 .624 0Z"
        />
      </svg>
    )
  }
)
Photo.displayName = "Photo"
export default Photo
