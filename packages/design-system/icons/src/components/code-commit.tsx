import * as React from "react"
import type { IconProps } from "../types"
const CodeCommit = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7.5 14.167v-3.958M7.5.834v3.958M10.208 7.5a2.708 2.708 0 1 0-5.416 0 2.708 2.708 0 0 0 5.416 0"
        />
      </svg>
    )
  }
)
CodeCommit.displayName = "CodeCommit"
export default CodeCommit
