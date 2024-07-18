import * as React from "react"
import type { IconProps } from "../types"
const PenPlus = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.389 13.5s3.199-.505 4.04-1.347c.843-.841 6.514-6.513 6.514-6.513a1.904 1.904 0 1 0-2.694-2.693L3.736 9.46c-.841.842-1.346 4.04-1.346 4.04zM3.278 1.056V5.5M5.5 3.278H1.056"
        />
      </svg>
    )
  }
)
PenPlus.displayName = "PenPlus"
export default PenPlus
