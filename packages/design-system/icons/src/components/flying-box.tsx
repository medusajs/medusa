import * as React from "react"
import type { IconProps } from "../types"
const FlyingBox = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M1.78 4.232h-.615M2.394 2.388H1.165M10.71 12.612H2.105M10.93 2.388l-.606 2.02a.615.615 0 0 1-.59.44H7.823a.615.615 0 0 1-.589-.792l.5-1.668M5.313 8.157H6.62" />
          <path d="M11.03 10.248H4.522c-.989 0-1.697-1.015-1.413-2.024l1.327-4.716c.188-.664.762-1.12 1.414-1.12h6.508c.989 0 1.697 1.016 1.414 2.024l-1.328 4.716c-.188.665-.762 1.12-1.414 1.12" />
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
FlyingBox.displayName = "FlyingBox"
export default FlyingBox
