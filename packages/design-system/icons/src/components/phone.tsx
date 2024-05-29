import * as React from "react"
import type { IconProps } from "../types"
const Phone = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10.389 1.056H4.61c-.982 0-1.778.796-1.778 1.777v9.334c0 .982.796 1.778 1.778 1.778h5.778c.982 0 1.778-.796 1.778-1.778V2.833c0-.981-.796-1.777-1.778-1.777"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6.389 1.056v.889H8.61v-.89M6.389 11.256H8.61"
        />
      </svg>
    )
  }
)
Phone.displayName = "Phone"
export default Phone
