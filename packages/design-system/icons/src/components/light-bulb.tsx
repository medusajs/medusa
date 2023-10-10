import * as React from "react"
import type { IconProps } from "../types"
const LightBulb = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 14.588v-4.015m0 0c.387 0 .773-.048 1.148-.145M10 10.573c-.387 0-.772-.048-1.147-.145m2.868 5.72a9.226 9.226 0 0 1-3.442 0m2.869 1.823c-.763.08-1.532.08-2.295 0m2.868-3.383v-.146c0-.752.504-1.395 1.154-1.772a5.736 5.736 0 1 0-5.75 0c.65.377 1.154 1.02 1.154 1.771v.147"
        />
      </svg>
    )
  }
)
LightBulb.displayName = "LightBulb"
export default LightBulb
