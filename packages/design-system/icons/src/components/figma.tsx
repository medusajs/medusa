import * as React from "react"
import type { IconProps } from "../types"
const Figma = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
            fill="#1ABCFE"
            d="M7.5 7.5a2.227 2.227 0 1 1 4.454 0 2.227 2.227 0 0 1-4.454 0"
          />
          <path
            fill="#0ACF83"
            d="M3.046 11.954c0-1.23.997-2.227 2.227-2.227H7.5v2.227a2.227 2.227 0 1 1-4.454 0"
          />
          <path
            fill="#FF7262"
            d="M7.5.819v4.454h2.227a2.227 2.227 0 1 0 0-4.454z"
          />
          <path
            fill="#F24E1E"
            d="M3.046 3.046c0 1.23.997 2.227 2.227 2.227H7.5V.819H5.273c-1.23 0-2.227.997-2.227 2.227"
          />
          <path
            fill="#A259FF"
            d="M3.046 7.5c0 1.23.997 2.227 2.227 2.227H7.5V5.273H5.273c-1.23 0-2.227.997-2.227 2.227"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M3 .75h9v13.5H3z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
Figma.displayName = "Figma"
export default Figma
