import * as React from "react"
import type { IconProps } from "../types"
const ShoppingCart = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            fill={color}
            fillRule="evenodd"
            d="M1.631.37a.75.75 0 0 0-.364 1.455l1.201.3a.14.14 0 0 1 .104.115l.238 1.615.005.038.663 4.501a1.862 1.862 0 0 0 .416 3.675h9.555a.75.75 0 0 0 0-1.5H3.894a.362.362 0 0 1 0-.722h.403a1 1 0 0 0 .083 0h7.095c.704 0 1.332-.45 1.556-1.121l1.184-3.555a1.64 1.64 0 0 0-1.555-2.157H4.202l-.146-.992A1.64 1.64 0 0 0 2.832.67zm2.792 4.144.564 3.833h6.488c.06 0 .114-.038.132-.094l1.185-3.556a.138.138 0 0 0-.132-.183zM3.227 14.653a1.111 1.111 0 1 0 0-2.222 1.111 1.111 0 0 0 0 2.222m10.445-1.111a1.111 1.111 0 1 1-2.223 0 1.111 1.111 0 0 1 2.223 0"
            clipRule="evenodd"
          />
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
ShoppingCart.displayName = "ShoppingCart"
export default ShoppingCart
