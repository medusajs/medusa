import * as React from "react"
import type { IconProps } from "../types"
const EyeSlash = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.5 10.389a2.889 2.889 0 1 0 0-5.778 2.889 2.889 0 0 0 0 5.778" />
          <path d="M7.5 12.833a7.3 7.3 0 0 1-1.52-.159.667.667 0 0 1 .28-1.304c.4.087.817.13 1.24.13 2.934 0 4.76-2.106 5.587-3.36a1.18 1.18 0 0 0 0-1.28 9 9 0 0 0-.808-1.052.667.667 0 1 1 .997-.887c.333.375.644.78.924 1.206.55.833.55 1.912 0 2.746-.975 1.48-3.142 3.96-6.7 3.96M3.904 11.761a.66.66 0 0 1-.36-.106C2.234 10.809 1.328 9.675.8 8.873a2.49 2.49 0 0 1 0-2.746c.975-1.48 3.142-3.96 6.7-3.96 1.415 0 2.747.396 3.957 1.178a.666.666 0 1 1-.723 1.12A5.87 5.87 0 0 0 7.5 3.501c-2.934 0-4.76 2.106-5.588 3.36a1.18 1.18 0 0 0 0 1.28c.459.694 1.24 1.674 2.354 2.395a.667.667 0 0 1-.362 1.226" />
          <path d="M1.278 14.389a.667.667 0 0 1-.471-1.139L13.25.807a.667.667 0 1 1 .943.943L1.75 14.193c-.13.13-.3.196-.471.196" />
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
EyeSlash.displayName = "EyeSlash"
export default EyeSlash
