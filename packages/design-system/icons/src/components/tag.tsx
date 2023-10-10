import * as React from "react"
import type { IconProps } from "../types"
const Tag = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.973 2.5H4.375A1.875 1.875 0 0 0 2.5 4.375v3.598c0 .498.197.975.55 1.326l7.983 7.984c.583.583 1.484.727 2.173.275a15.078 15.078 0 0 0 4.352-4.352c.452-.69.308-1.59-.275-2.173L9.3 3.05a1.875 1.875 0 0 0-1.327-.55Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 6h.006v.006H6V6Z"
        />
      </svg>
    )
  }
)
Tag.displayName = "Tag"
export default Tag
