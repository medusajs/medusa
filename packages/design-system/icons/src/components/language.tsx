import * as React from "react"
import type { IconProps } from "../types"
const Language = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.5 3.278h7.111M5.056 1.5v1.778M3.278 3.278a5.43 5.43 0 0 0 3.577 4.919"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6.833 3.278C6.478 8.278 1.5 8.61 1.5 8.61M7.722 13.5l2.667-7.111h.444l2.667 7.11M8.556 11.278h4.111"
        />
      </svg>
    )
  }
)
Language.displayName = "Language"
export default Language
