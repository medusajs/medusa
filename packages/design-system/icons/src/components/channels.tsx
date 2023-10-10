import * as React from "react"
import type { IconProps } from "../types"
const Channels = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.719 5.875a1.687 1.687 0 1 0 0-3.375 1.687 1.687 0 0 0 0 3.375ZM14.719 11.688a1.687 1.687 0 1 0 0-3.375 1.687 1.687 0 0 0 0 3.374ZM4.594 11.688a1.687 1.687 0 1 0 0-3.375 1.687 1.687 0 0 0 0 3.374ZM14.719 17.5a1.687 1.687 0 1 0 0-3.375 1.687 1.687 0 0 0 0 3.375Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.03 4.188h-1.874a1.5 1.5 0 0 0-1.5 1.5v8.625a1.5 1.5 0 0 0 1.5 1.5h1.875M13.03 10H6.28"
        />
      </svg>
    )
  }
)
Channels.displayName = "Channels"
export default Channels
