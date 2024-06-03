import * as React from "react"
import type { IconProps } from "../types"
const ArrowPath = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M13.944 7.5A6.444 6.444 0 0 1 1.536 9.944" />
          <path d="m1.171 12.562.363-2.618 2.617.362M1.056 7.5a6.445 6.445 0 0 1 12.408-2.444" />
          <path d="m13.829 2.438-.363 2.618-2.617-.362" />
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
ArrowPath.displayName = "ArrowPath"
export default ArrowPath
