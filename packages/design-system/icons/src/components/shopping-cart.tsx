import * as React from "react"
import type { IconProps } from "../types"
const ShoppingCart = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2 2.574h1.144c.42 0 .788.283.896.69l.316 1.185m0 0A49.599 49.599 0 0 1 18 5.967a49.17 49.17 0 0 1-2.412 5.89H6.332M4.356 4.448l1.976 7.407m0 0a2.475 2.475 0 0 0-2.476 2.476h12.996M5.094 16.807a.619.619 0 1 1-1.238 0 .619.619 0 0 1 1.238 0Zm10.52 0a.619.619 0 1 1-1.238 0 .619.619 0 0 1 1.238 0Z"
        />
      </svg>
    )
  }
)
ShoppingCart.displayName = "ShoppingCart"
export default ShoppingCart
