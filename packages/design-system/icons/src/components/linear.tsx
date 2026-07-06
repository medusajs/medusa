import * as React from "react"
import type { IconProps } from "../types"
const Linear = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <g clipPath="url(#a)">
          <path
            fill="#222326"
            d="M.915 9.056c-.03-.128.123-.21.216-.116l4.93 4.93c.092.092.011.245-.117.215a6.77 6.77 0 0 1-5.029-5.03M.75 7.08a.13.13 0 0 0 .04.103l7.027 7.028a.13.13 0 0 0 .103.039q.48-.03.94-.125a.131.131 0 0 0 .064-.223L1.098 6.076a.131.131 0 0 0-.223.064Q.78 6.6.75 7.08m.568-2.32a.13.13 0 0 0 .029.149l8.744 8.744c.04.04.098.051.149.028a7 7 0 0 0 .7-.362.133.133 0 0 0 .024-.208L1.89 4.035a.133.133 0 0 0-.208.025 7 7 0 0 0-.363.7m1.14-1.57a.133.133 0 0 1-.005-.183 6.756 6.756 0 1 1 9.54 9.54.133.133 0 0 1-.183-.006z"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M.75.75h13.5v13.5H.75z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
Linear.displayName = "Linear"
export default Linear
