import * as React from "react"
import type { IconProps } from "../types"
const FlyingBox = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 1.5v5.333M11.278 4.167H3.722c-.982 0-1.778.796-1.778 1.778v5.333c0 .982.796 1.778 1.778 1.778h7.556c.982 0 1.778-.796 1.778-1.778V5.945c0-.982-.796-1.778-1.778-1.778"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m2.167 5.086 1.288-2.598c.3-.605.917-.988 1.593-.988h4.904c.676 0 1.293.383 1.593.988l1.288 2.599M4.167 10.833h1.777"
        />
      </svg>
    )
  }
)
FlyingBox.displayName = "FlyingBox"
export default FlyingBox
