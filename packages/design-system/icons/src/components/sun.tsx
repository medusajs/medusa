import * as React from "react"
import type { IconProps } from "../types"
const Sun = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.5 1.042v.833M12.067 2.933l-.59.59M13.958 7.5h-.833M12.067 12.067l-.59-.59M7.5 13.958v-.833M2.933 12.067l.59-.59M1.042 7.5h.833M2.933 2.933l.59.59M7.5 11.042a3.542 3.542 0 1 0 0-7.084 3.542 3.542 0 0 0 0 7.084" />
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
Sun.displayName = "Sun"
export default Sun
