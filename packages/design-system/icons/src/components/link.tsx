import * as React from "react"
import type { IconProps } from "../types"
const Link = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10.992 7.24a3.75 3.75 0 0 1 1.035 6.037l-3.75 3.75a3.75 3.75 0 0 1-5.304-5.304l1.465-1.464m11.125-.518 1.464-1.464a3.75 3.75 0 0 0-5.304-5.304l-3.75 3.75a3.75 3.75 0 0 0 1.035 6.037"
        />
      </svg>
    )
  }
)
Link.displayName = "Link"
export default Link
