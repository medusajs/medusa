import * as React from "react"
import type { IconProps } from "../types"
const Phone = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.75 1.25H6.875A1.875 1.875 0 0 0 5 3.125v13.75a1.875 1.875 0 0 0 1.875 1.875h6.25A1.875 1.875 0 0 0 15 16.875V3.125a1.875 1.875 0 0 0-1.875-1.875H11.25m-2.5 0V2.5h2.5V1.25m-2.5 0h2.5m-2.5 15.625h2.5"
        />
      </svg>
    )
  }
)
Phone.displayName = "Phone"
export default Phone
