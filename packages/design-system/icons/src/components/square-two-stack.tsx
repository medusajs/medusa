import * as React from "react"
import type { IconProps } from "../types"
const SquareTwoStack = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.75 6.875V5a1.875 1.875 0 0 0-1.875-1.875H5A1.875 1.875 0 0 0 3.125 5v6.875A1.875 1.875 0 0 0 5 13.75h1.875m6.875-6.875H15a1.875 1.875 0 0 1 1.875 1.875V15A1.875 1.875 0 0 1 15 16.875H8.75A1.875 1.875 0 0 1 6.875 15v-1.25m6.875-6.875h-5A1.875 1.875 0 0 0 6.875 8.75v5"
        />
      </svg>
    )
  }
)
SquareTwoStack.displayName = "SquareTwoStack"
export default SquareTwoStack
