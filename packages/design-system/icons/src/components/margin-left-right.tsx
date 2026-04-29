import * as React from "react"
import type { IconProps } from "../types"
const MarginLeftRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.944 13.055V1.945M9.5 4.611h-4a.89.89 0 0 0-.889.89v4c0 .49.398.888.889.888h4c.49 0 .889-.398.889-.889v-4a.89.89 0 0 0-.889-.889M13.556 13.055V1.945"
        />
      </svg>
    )
  }
)
MarginLeftRight.displayName = "MarginLeftRight"
export default MarginLeftRight
