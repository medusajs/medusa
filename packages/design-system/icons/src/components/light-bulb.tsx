import * as React from "react"
import type { IconProps } from "../types"
const LightBulb = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.5 11.278h4M11.944 5.5a4.45 4.45 0 0 0-5.402-4.344c-1.718.358-3.09 1.771-3.408 3.496A4.445 4.445 0 0 0 5.5 9.465v2.701c0 .983.796 1.778 1.778 1.778h.444c.982 0 1.778-.795 1.778-1.778v-2.7A4.44 4.44 0 0 0 11.944 5.5"
        />
      </svg>
    )
  }
)
LightBulb.displayName = "LightBulb"
export default LightBulb
