import * as React from "react"
import type { IconProps } from "../types"
const GlobeEuropeSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M18 10a8 8 0 1 1-16.001 0A8 8 0 0 1 18 10Zm-1.503.204A6.5 6.5 0 1 1 7.95 3.83L6.927 5.62a1.453 1.453 0 0 0 1.91 2.02l.175-.087a.5.5 0 0 1 .224-.053h.146a.5.5 0 0 1 .447.724l-.028.055a.4.4 0 0 1-.357.221h-.502a2.26 2.26 0 0 0-1.88 1.006l-.044.066a2.099 2.099 0 0 0 1.085 3.156.58.58 0 0 1 .397.547v1.05a1.175 1.175 0 0 0 2.093.734l1.611-2.014c.192-.24.296-.536.296-.842 0-.316.128-.624.353-.85a1.362 1.362 0 0 0 .173-1.716l-.464-.696a.369.369 0 0 1 .527-.499l.343.257a1.04 1.04 0 0 0 1.091.098.586.586 0 0 1 .677.11l1.297 1.297Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
GlobeEuropeSolid.displayName = "GlobeEuropeSolid"
export default GlobeEuropeSolid
