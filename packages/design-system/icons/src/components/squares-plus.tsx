import * as React from "react"
import type { IconProps } from "../types"
const SquaresPlus = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.25 14.063h2.813m0 0h2.812m-2.813 0V11.25m0 2.813v2.812M5 8.75h1.875A1.875 1.875 0 0 0 8.75 6.875V5a1.875 1.875 0 0 0-1.875-1.875H5A1.875 1.875 0 0 0 3.125 5v1.875A1.875 1.875 0 0 0 5 8.75v0Zm0 8.125h1.875A1.875 1.875 0 0 0 8.75 15v-1.875a1.875 1.875 0 0 0-1.875-1.875H5a1.875 1.875 0 0 0-1.875 1.875V15A1.875 1.875 0 0 0 5 16.875Zm8.125-8.125H15a1.875 1.875 0 0 0 1.875-1.875V5A1.875 1.875 0 0 0 15 3.125h-1.875A1.875 1.875 0 0 0 11.25 5v1.875a1.875 1.875 0 0 0 1.875 1.875v0Z"
        />
      </svg>
    )
  }
)
SquaresPlus.displayName = "SquaresPlus"
export default SquaresPlus
