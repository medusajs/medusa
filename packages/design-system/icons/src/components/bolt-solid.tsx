import * as React from "react"
import type { IconProps } from "../types"
const BoltSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.034 1.577a.6.6 0 0 1 .254.295.63.63 0 0 1 .025.394l-1.55 5.912h5.654c.113 0 .225.035.32.1a.6.6 0 0 1 .215.266.63.63 0 0 1-.11.656l-8.166 9.107a.564.564 0 0 1-.711.116.6.6 0 0 1-.254-.296.63.63 0 0 1-.024-.395l1.55-5.911H3.582a.567.567 0 0 1-.32-.1.602.602 0 0 1-.215-.265.63.63 0 0 1 .11-.657l8.166-9.106a.564.564 0 0 1 .71-.116Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
BoltSolid.displayName = "BoltSolid"
export default BoltSolid
