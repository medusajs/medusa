import * as React from "react"
import type { IconProps } from "../types"
const TagSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M4.782 2A2.782 2.782 0 0 0 2 4.782v3.204c0 .737.293 1.444.815 1.966l7.233 7.233a2.782 2.782 0 0 0 3.934 0l3.203-3.203a2.784 2.784 0 0 0 0-3.934L9.952 2.815A2.782 2.782 0 0 0 7.987 2H4.782Zm.556 4.451a1.113 1.113 0 1 0 0-2.226 1.113 1.113 0 0 0 0 2.226Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
TagSolid.displayName = "TagSolid"
export default TagSolid
