import * as React from "react"
import type { IconProps } from "../types"
const ForwardSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.213 5.259a1.563 1.563 0 0 0-2.338 1.356v6.77c0 1.2 1.296 1.951 2.338 1.356L10 11.435v1.95c0 1.2 1.296 1.951 2.338 1.356l5.923-3.384a1.562 1.562 0 0 0 0-2.713l-5.923-3.385A1.563 1.563 0 0 0 10 6.615v1.95L4.213 5.26Z"
        />
      </svg>
    )
  }
)
ForwardSolid.displayName = "ForwardSolid"
export default ForwardSolid
