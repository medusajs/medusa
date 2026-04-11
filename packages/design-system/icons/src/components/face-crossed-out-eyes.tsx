import * as React from "react"
import type { IconProps } from "../types"
const FaceCrossedOutEyes = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill={color}
          d="M8.389 11.056H6.61a.445.445 0 0 1-.444-.445 1.334 1.334 0 0 1 2.666 0c0 .246-.199.445-.444.445"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5 13.945a6.444 6.444 0 1 0 0-12.89 6.444 6.444 0 0 0 0 12.89M3.722 5.944l2.222 2.223M5.944 5.944 3.722 8.167M9.056 5.944l2.222 2.223M11.278 5.944 9.056 8.167"
        />
      </svg>
    )
  }
)
FaceCrossedOutEyes.displayName = "FaceCrossedOutEyes"
export default FaceCrossedOutEyes
