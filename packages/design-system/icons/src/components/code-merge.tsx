import * as React from "react"
import type { IconProps } from "../types"
const CodeMerge = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.722 5.056v8.889M9.278 10.611a5.555 5.555 0 0 1-5.556-5.555M3.722 5.056a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.278 12.61a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
        />
      </svg>
    )
  }
)
CodeMerge.displayName = "CodeMerge"
export default CodeMerge
