import * as React from "react"
import type { IconProps } from "../types"
const Trophy = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.944 10.389s0 2.611 3.334 3.555H3.722C7.056 13 7.056 10.39 7.056 10.39M4.199 7.5c-3.393 0-3.143-4.666-3.143-4.666h1.988M10.801 7.5c3.394 0 3.143-4.666 3.143-4.666h-1.988"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.944 1.056c-.555 5.805-2.027 9.083-4.222 9.333h-.444c-2.195-.25-3.667-3.528-4.222-9.333z"
        />
      </svg>
    )
  }
)
Trophy.displayName = "Trophy"
export default Trophy
