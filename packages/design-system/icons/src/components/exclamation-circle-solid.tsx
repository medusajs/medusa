import * as React from "react"
import type { IconProps } from "../types"
const ExclamationCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M18 10a8 8 0 1 1-16.001 0A8 8 0 0 1 18 10Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 1 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ExclamationCircleSolid.displayName = "ExclamationCircleSolid"
export default ExclamationCircleSolid
