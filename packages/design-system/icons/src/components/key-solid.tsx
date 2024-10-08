import * as React from "react"
import type { IconProps } from "../types"
const KeySolid = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M1.344 14.164a.66.66 0 0 1-.484-.21.68.68 0 0 1-.18-.498l.158-2.531a.67.67 0 0 1 .193-.43L6.01 5.518a4 4 0 0 1-.065-.685A4.227 4.227 0 0 1 10.167.611a4.227 4.227 0 0 1 4.222 4.222 4.227 4.227 0 0 1-4.222 4.223 3.8 3.8 0 0 1-.721-.072l-1.482 1.439a.67.67 0 0 1-.464.188H6.167v1.333a.67.67 0 0 1-.18.456L4.523 13.96a.67.67 0 0 1-.487.21zM11.5 4.389a.89.89 0 1 0-1.779 0 .89.89 0 0 0 1.779 0"
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
KeySolid.displayName = "KeySolid"
export default KeySolid
