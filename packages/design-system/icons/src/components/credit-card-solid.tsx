import * as React from "react"
import type { IconProps } from "../types"
const CreditCardSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M14.611 4.611a2.446 2.446 0 0 0-2.444-2.444H2.833A2.446 2.446 0 0 0 .39 4.61v.667H14.61zM.389 10.389a2.446 2.446 0 0 0 2.444 2.444h9.334a2.446 2.446 0 0 0 2.444-2.444V6.61H.39zm10.444-1.556h.89a.667.667 0 0 1 0 1.334h-.89a.667.667 0 0 1 0-1.334m-7.555 0h2.666a.667.667 0 0 1 0 1.334H3.278a.667.667 0 0 1 0-1.334" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
CreditCardSolid.displayName = "CreditCardSolid"
export default CreditCardSolid
