import * as React from "react"
import type { IconProps } from "../types"
const Typography = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.5 13.056h4M7.5 1.944v11.111M12.611 3.278l-.667-1.334H3.057l-.667 1.334"
        />
      </svg>
    )
  }
)
Typography.displayName = "Typography"
export default Typography
