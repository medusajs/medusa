import * as React from "react"
import type { IconProps } from "../types"
const Robot = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 1.813v2.416M12.938 11.479a1.61 1.61 0 0 1-1.612 1.611H3.674a1.61 1.61 0 0 1-1.611-1.611V5.84c0-.89.72-1.611 1.61-1.611h7.653c.89 0 1.611.721 1.611 1.611zM2.062 8.66H1.056M12.938 8.66h1.006"
        />
        <path
          fill={color}
          d="M7.5 2.618A1.31 1.31 0 1 0 7.5 0a1.31 1.31 0 0 0 0 2.62M5.5 8.66a1 1 0 1 0 0-2.001 1 1 0 0 0 0 2M9.5 8.66a1 1 0 1 0 0-2.001 1 1 0 0 0 0 2"
        />
      </svg>
    )
  }
)
Robot.displayName = "Robot"
export default Robot
