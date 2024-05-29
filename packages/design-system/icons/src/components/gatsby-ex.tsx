import * as React from "react"
import type { IconProps } from "../types"
const GatsbyEx = React.forwardRef<SVGSVGElement, IconProps>(
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
            d="M14.25 7.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0m-12.054.097c0 1.301.53 2.651 1.543 3.664 1.013 1.012 2.363 1.495 3.713 1.543zm.145-1.254 6.316 6.316c2.363-.53 4.147-2.652 4.147-5.159H9.429v.964h2.314c-.338 1.447-1.398 2.652-2.797 3.134L3.402 6.054C4.029 4.366 5.62 3.16 7.5 3.16c1.446 0 2.748.723 3.568 1.832l.723-.627A5.32 5.32 0 0 0 7.5 2.196c-2.507 0-4.629 1.784-5.159 4.147"
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
GatsbyEx.displayName = "GatsbyEx"
export default GatsbyEx
