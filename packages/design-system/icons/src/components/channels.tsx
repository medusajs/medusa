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
          d="M13.031 4.188a1.687 1.687 0 1 0 3.375 0 1.687 1.687 0 0 0-3.375 0Zm0 0h-1.875a1.5 1.5 0 0 0-1.5 1.5v8.625a1.5 1.5 0 0 0 1.5 1.5h1.875M6.281 10a1.687 1.687 0 1 1-3.375 0 1.687 1.687 0 0 1 3.375 0Zm0 0h6.75m0 5.813a1.688 1.688 0 1 0 3.375 0 1.688 1.688 0 0 0-3.375 0ZM16.406 10a1.687 1.687 0 1 1-3.375 0 1.687 1.687 0 0 1 3.375 0Z"
        />
      </svg>
    )
  }
)
Channels.displayName = "Channels"
export default Channels
