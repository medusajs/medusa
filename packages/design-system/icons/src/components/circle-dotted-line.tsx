import * as React from "react"
import type { IconProps } from "../types"
const CircleDottedLine = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M3.933 2.132a6.4 6.4 0 0 1 2.322-.956M1.17 6.283a6.4 6.4 0 0 1 .97-2.362M3.933 12.868c.691.46 1.477.791 2.322.956M1.17 8.717c.165.86.5 1.66.97 2.362M8.745 1.176c.845.165 1.63.496 2.322.956M12.86 3.921a6.4 6.4 0 0 1 .97 2.362M8.745 13.824a6.4 6.4 0 0 0 2.322-.956M12.86 11.079c.47-.703.805-1.502.97-2.362" />
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
CircleDottedLine.displayName = "CircleDottedLine"
export default CircleDottedLine
