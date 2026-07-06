import * as React from "react"
import type { IconProps } from "../types"
const MarkdownSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
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
        <path
          fill={color}
          d="M12.708 2.5H2.292A2.294 2.294 0 0 0 0 4.792v5.416A2.294 2.294 0 0 0 2.292 12.5h10.416A2.294 2.294 0 0 0 15 10.208V4.792A2.294 2.294 0 0 0 12.708 2.5M7.917 9.375a.625.625 0 0 1-1.25 0V7.041l-.963 1.256c-.236.308-.756.308-.991 0L3.75 7.04v2.334a.625.625 0 0 1-1.25 0v-3.75c0-.345.28-.625.625-.625h.328c.195 0 .379.09.496.245l1.26 1.644 1.259-1.644A.63.63 0 0 1 6.963 5h.329c.345 0 .625.28.625.625zm5.025-1.017-1.459 1.459a.623.623 0 0 1-.883 0L9.142 8.358a.625.625 0 1 1 .884-.884l.392.392V5.625a.625.625 0 0 1 1.25 0v2.24l.391-.39a.625.625 0 1 1 .884.883z"
        />
      </svg>
    )
  }
)
MarkdownSolid.displayName = "MarkdownSolid"
export default MarkdownSolid
