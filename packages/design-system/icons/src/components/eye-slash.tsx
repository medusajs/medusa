import * as React from "react"
import type { IconProps } from "../types"
const EyeSlash = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.317 6.853A8.731 8.731 0 0 0 1.612 10a8.755 8.755 0 0 0 10.774 5.92M5.19 5.19a8.755 8.755 0 0 1 13.197 4.808 8.77 8.77 0 0 1-3.577 4.812M5.19 5.19 2.5 2.5m2.69 2.69 3.042 3.042m6.578 6.578 2.69 2.69m-2.69-2.69-3.042-3.042a2.5 2.5 0 0 0-3.535-3.536m3.534 3.536L8.233 8.232"
        />
      </svg>
    )
  }
)
EyeSlash.displayName = "EyeSlash"
export default EyeSlash
