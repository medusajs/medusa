import * as React from "react"
import type { IconProps } from "../types"
const ComponentSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.125 7.375 7.75 10l-2.625 2.625L2.5 10l2.625-2.625ZM10 2.5l2.625 2.625L10 7.75 7.375 5.125 10 2.5ZM14.875 7.375 17.5 10l-2.625 2.625L12.25 10l2.625-2.625ZM10 12.25l2.625 2.625L10 17.5l-2.625-2.625L10 12.25Z"
        />
      </svg>
    )
  }
)
ComponentSolid.displayName = "ComponentSolid"
export default ComponentSolid
