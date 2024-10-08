import * as React from "react"
import type { IconProps } from "../types"
const BellAlertSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M13.5 10.611A1.113 1.113 0 0 1 12.389 9.5V5.278a4.894 4.894 0 0 0-4.89-4.89 4.894 4.894 0 0 0-4.888 4.89V9.5c0 .613-.499 1.111-1.111 1.111a.667.667 0 0 0 0 1.333h12a.667.667 0 0 0 0-1.333M8.567 12.833H6.434A.444.444 0 0 0 6 13.37c.153.731.771 1.242 1.5 1.242.73 0 1.348-.511 1.502-1.242a.445.445 0 0 0-.434-.536z"
        />
      </svg>
    )
  }
)
BellAlertSolid.displayName = "BellAlertSolid"
export default BellAlertSolid
