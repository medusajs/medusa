import * as React from "react"
import type { IconProps } from "../types"
const MapPin = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.5 8.438a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0v0Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16.25 8.438c0 5.951-6.25 9.374-6.25 9.374S3.75 14.39 3.75 8.438a6.25 6.25 0 0 1 12.5 0v0Z"
        />
      </svg>
    )
  }
)
MapPin.displayName = "MapPin"
export default MapPin
