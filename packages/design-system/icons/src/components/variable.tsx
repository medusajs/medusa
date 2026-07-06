import * as React from "react"
import type { IconProps } from "../types"
const Variable = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.3 4.75c2.75 0 2.2 5.5 4.95 5.5"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10.8 4.75c-2.75 0-3.3 5.5-6.6 5.5"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.5}
          d="M2.5 13S1 11.007 1 7.504 2.5 2 2.5 2M12.5 2S14 3.993 14 7.496 12.5 13 12.5 13"
        />
      </svg>
    )
  }
)
Variable.displayName = "Variable"
export default Variable
