import * as React from "react"
import type { IconProps } from "../types"
const LayoutRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.833 13.056h9.334c.982 0 1.777-.796 1.777-1.778V3.722c0-.982-.796-1.777-1.777-1.777H2.833c-.981 0-1.777.795-1.777 1.777v7.556c0 .982.796 1.778 1.777 1.778M11.278 4.611v5.778"
        />
      </svg>
    )
  }
)
LayoutRight.displayName = "LayoutRight"
export default LayoutRight
