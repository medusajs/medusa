import * as React from "react"
import type { IconProps } from "../types"
const HandTruck = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10.192 2.927 6.465 3.99a.86.86 0 0 0-.591 1.064l.944 3.312a.86.86 0 0 0 1.065.592l3.726-1.063a.86.86 0 0 0 .592-1.064l-.945-3.312a.86.86 0 0 0-1.064-.592M8.328 3.459l.473 1.656M6.876 11.708l7.298-2.081M4.933 10.357 2.77 2.744a.86.86 0 0 0-.828-.626h-.9"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.347 13.313a1.507 1.507 0 1 0 0-3.014 1.507 1.507 0 0 0 0 3.014"
        />
      </svg>
    )
  }
)
HandTruck.displayName = "HandTruck"
export default HandTruck
