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
          d="M17.014 16.542V8.8a.774.774 0 0 0-.774-.775h-3.097"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.077 16.542V4.154a.774.774 0 0 1 .775-.774h8.516a.774.774 0 0 1 .775.774v12.388M5.98 6.652h4.26M5.98 9.96h4.26"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.98 16.542h4.26V13.21H5.98v3.333ZM17.788 16.542H2.303"
        />
      </svg>
    )
  }
)
Buildings.displayName = "Buildings"
export default Buildings
