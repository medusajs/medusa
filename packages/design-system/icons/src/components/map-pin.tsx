import * as React from "react"
import type { IconProps } from "../types"
const MapPin = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.637 5.959c0 2.33-3.047 6.073-4.448 7.672a.914.914 0 0 1-1.379 0c-1.4-1.598-4.448-5.34-4.448-7.672.001-3.103 2.655-4.903 5.138-4.903s5.137 1.8 5.137 4.903"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M7.5 5.361a.806.806 0 1 0 0 1.611.806.806 0 0 0 0-1.61m-2.306.806a2.306 2.306 0 1 1 4.612 0 2.306 2.306 0 0 1-4.612 0"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
MapPin.displayName = "MapPin"
export default MapPin
