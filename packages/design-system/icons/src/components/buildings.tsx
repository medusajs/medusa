import * as React from "react"
import type { IconProps } from "../types"
const Buildings = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M17.014 16.542V8.8a.774.774 0 0 0-.774-.775h-3.097M3.077 16.542V4.154a.774.774 0 0 1 .775-.774h8.516a.774.774 0 0 1 .775.774v12.388M5.98 6.652h4.258M5.981 9.961h4.258m7.55 6.581H2.302m7.936 0H5.981V13.21h4.258v3.333Z"
        />
      </svg>
    )
  }
)
Buildings.displayName = "Buildings"
export default Buildings
