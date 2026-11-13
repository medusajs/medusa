import * as React from "react"
import type { IconProps } from "../types"
const Megaphone = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.611 4.611H2.833a1.78 1.78 0 0 0-1.777 1.778v1.333A1.78 1.78 0 0 0 2.833 9.5h1.778l5.778 2.667V1.944zm0 0V9.5m-1.778 0v2.445c0 .613.498 1.111 1.111 1.111h.667c.614 0 1.111-.498 1.111-1.111v-1.932m7.334-4.735a2.222 2.222 0 0 1 0 3.556"
        />
      </svg>
    )
  }
)
Megaphone.displayName = "Megaphone"
export default Megaphone
