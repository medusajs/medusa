import * as React from "react"
import type { IconProps } from "../types"
const Text = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.572 12.355h6.493M5.826 4.823l-3.96 9.18M9.771 14.003l-3.945-9.18M18.134 8.451v5.538M17.319 9.253a2.784 2.784 0 1 1-3.938 3.937 2.784 2.784 0 0 1 3.938-3.937Z"
        />
      </svg>
    )
  }
)
Text.displayName = "Text"
export default Text
