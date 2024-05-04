import * as React from "react"
import type { IconProps } from "../types"
const CreditCardSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.976 3.373a2.41 2.41 0 0 0-2.41 2.41v.602h16.868v-.602a2.41 2.41 0 0 0-2.41-2.41H3.976Z"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M18.434 8.193H1.566v6.024a2.41 2.41 0 0 0 2.41 2.41h12.048a2.41 2.41 0 0 0 2.41-2.41V8.193ZM3.976 11.205a.602.602 0 0 1 .602-.602h4.82a.603.603 0 0 1 0 1.205h-4.82a.603.603 0 0 1-.602-.603Zm.602 1.808a.603.603 0 0 0 0 1.204h2.41a.602.602 0 1 0 0-1.204h-2.41Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
CreditCardSolid.displayName = "CreditCardSolid"
export default CreditCardSolid
