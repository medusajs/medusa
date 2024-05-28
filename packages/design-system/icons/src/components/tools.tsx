import * as React from "react"
import type { IconProps } from "../types"
const Tools = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.5 4.389a3.33 3.33 0 0 0-2-3.052v3.274H2.833V1.337a3.33 3.33 0 0 0-2 3.052 3.33 3.33 0 0 0 2 3.052v5.615c0 .49.399.889.89.889h.888a.89.89 0 0 0 .889-.89V7.442a3.33 3.33 0 0 0 2-3.052M13.056 7.722v5.334a.89.89 0 0 1-.89.888h-.888a.89.89 0 0 1-.89-.889V7.723M9.5 7.722h4.444M11.722 7.722V1.5M11.722 4.167l.89-1.556-.445-1.555h-.89l-.444 1.555z" />
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
Tools.displayName = "Tools"
export default Tools
