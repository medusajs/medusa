import * as React from "react"
import type { IconProps } from "../types"
const Target = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m7.5 7.5 2.708-2.708M10.208 4.791V2.916L12.292.833v1.875h1.875l-2.084 2.083z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.633 1.568a6 6 0 0 0-1.133-.11A6.042 6.042 0 1 0 13.542 7.5c0-.388-.04-.766-.11-1.134"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.04 4.012a3.5 3.5 0 0 0-.54-.054A3.542 3.542 0 1 0 11.042 7.5c0-.185-.028-.364-.054-.541"
        />
      </svg>
    )
  }
)
Target.displayName = "Target"
export default Target
