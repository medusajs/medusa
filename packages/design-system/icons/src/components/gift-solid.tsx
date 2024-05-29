import * as React from "react"
import type { IconProps } from "../types"
const GiftSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M2.167 7.944v4.223A2.446 2.446 0 0 0 4.61 14.61h2.222V7.944zM8.167 7.944v6.667h2.222a2.446 2.446 0 0 0 2.444-2.444V7.944zM13.056 3.5h-.411a2.2 2.2 0 0 0 .188-.889A2.225 2.225 0 0 0 10.611.39C9.046.389 8.065 1.483 7.5 2.468 6.935 1.484 5.954.388 4.389.388a2.225 2.225 0 0 0-2.222 2.223c0 .317.068.616.188.889h-.41c-.858 0-1.556.69-1.556 1.556 0 .865.698 1.555 1.555 1.555h11.112a1.555 1.555 0 1 0 0-3.111M10.61 1.722a.89.89 0 0 1 0 1.778h-2.15c.36-.764 1.045-1.778 2.15-1.778m-7.111.89a.89.89 0 0 1 .889-.89c1.097 0 1.784 1.014 2.147 1.778H4.389a.89.89 0 0 1-.889-.889" />
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
GiftSolid.displayName = "GiftSolid"
export default GiftSolid
