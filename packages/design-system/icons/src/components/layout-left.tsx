import * as React from "react"
import type { IconProps } from "../types"
const LayoutLeft = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.167 1.944H2.833c-.982 0-1.777.796-1.777 1.778v7.556c0 .981.795 1.777 1.777 1.777h9.334c.982 0 1.777-.796 1.777-1.777V3.722c0-.982-.796-1.778-1.777-1.778M3.722 4.611v5.778"
        />
      </svg>
    )
  }
)
LayoutLeft.displayName = "LayoutLeft"
export default LayoutLeft
