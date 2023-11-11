import * as React from "react"
import type { IconProps } from "../types"
const FlyingBox = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.623 5.902h-.819M3.442 3.443H1.804M14.098 16.556H2.624M14.323 3.443l-.808 2.694a.82.82 0 0 1-.786.585h-2.55a.82.82 0 0 1-.785-1.055l.667-2.224M6.72 10.82h1.745"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.456 13.278H5.78a1.967 1.967 0 0 1-1.884-2.532l1.77-5.901a1.967 1.967 0 0 1 1.884-1.402h8.678a1.967 1.967 0 0 1 1.885 2.533l-1.77 5.9a1.968 1.968 0 0 1-1.886 1.402Z"
        />
      </svg>
    )
  }
)
FlyingBox.displayName = "FlyingBox"
export default FlyingBox
