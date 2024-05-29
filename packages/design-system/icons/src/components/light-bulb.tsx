import * as React from "react"
import type { IconProps } from "../types"
const LightBulb = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 9.5V6.833L5.722 5.056M7.5 6.833l1.778-1.777M5.5 11.722h4"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.944 5.5a4.45 4.45 0 0 0-5.402-4.344c-1.718.358-3.09 1.772-3.408 3.496A4.445 4.445 0 0 0 5.5 9.465v2.702c0 .982.796 1.777 1.778 1.777h.444c.982 0 1.778-.795 1.778-1.777V9.465A4.44 4.44 0 0 0 11.944 5.5M5.5 9.5h4"
        />
      </svg>
    )
  }
)
LightBulb.displayName = "LightBulb"
export default LightBulb
